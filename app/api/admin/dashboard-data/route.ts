import { FieldValue } from "firebase-admin/firestore";
import { NextResponse, type NextRequest } from "next/server";
import { getCurrentUser, isSameOriginRequest } from "@/lib/auth";
import { firestore } from "@/lib/firebase-admin";
import { DashboardUploadError, parseDashboardDataUpload } from "@/lib/dashboard-data-upload";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const MAX_REQUEST_BYTES = MAX_UPLOAD_BYTES + 64 * 1024;

export async function POST(request: NextRequest) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ message: "Permintaan tidak valid." }, { status: 403 });
  }

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: "Silakan masuk." }, { status: 401 });
  }
  if (user.role !== "admin") {
    return NextResponse.json({ message: "Akses khusus admin." }, { status: 403 });
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_REQUEST_BYTES) {
    return NextResponse.json({ message: "Ukuran file maksimal 5 MB." }, { status: 413 });
  }

  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ message: "Pilih file XLSX atau JSON terlebih dahulu." }, { status: 400 });
  }
  if (file.size === 0 || file.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json({ message: "Ukuran file harus lebih dari 0 dan maksimal 5 MB." }, { status: 413 });
  }

  let records;
  try {
    records = parseDashboardDataUpload(file.name, Buffer.from(await file.arrayBuffer()));
  } catch (error) {
    return NextResponse.json(
      {
        message: error instanceof DashboardUploadError
          ? error.message
          : "File tidak dapat diproses. Periksa kembali isi data.",
      },
      { status: 400 },
    );
  }

  try {
    const batch = firestore.batch();
    for (const record of records) {
      const document: Record<string, unknown> = {
        Tahun: record.Tahun,
        pdrbLu: record.pdrbLu,
        pdrbExp: record.pdrbExp,
        socioeko: record.socioeko,
        updatedBy: user.uid,
        updatedAt: FieldValue.serverTimestamp(),
      };
      if (record.demografi?.length) document.demografi = record.demografi;

      batch.set(
        firestore.collection("dashboardData").doc(String(record.Tahun)),
        document,
        { merge: true },
      );
    }
    await batch.commit();

    const response = NextResponse.json({
      ok: true,
      years: records.map(({ Tahun }) => Tahun),
      includesDemografi: records.some((record) => Boolean(record.demografi?.length)),
    });
    response.headers.set("Cache-Control", "no-store");
    return response;
  } catch {
    return NextResponse.json(
      { message: "Data belum dapat disimpan. Periksa koneksi Firestore dan coba lagi." },
      { status: 503 },
    );
  }
}
