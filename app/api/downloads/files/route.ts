import { FieldValue } from "firebase-admin/firestore";
import { NextResponse, type NextRequest } from "next/server";
import { DOWNLOAD_FILE_CATEGORIES } from "@/lib/download-catalog";
import { getCurrentUser, isSameOriginRequest } from "@/lib/auth";
import { firestore } from "@/lib/firebase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const MAX_REQUEST_BYTES = MAX_UPLOAD_BYTES + 64 * 1024;
const CHUNK_BYTES = 512 * 1024;

const contentTypeByExtension: Record<string, string> = {
  csv: "text/csv; charset=utf-8",
  json: "application/json; charset=utf-8",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
};

function isDownloadCategory(value: string) {
  return DOWNLOAD_FILE_CATEGORIES.some((category) => category === value);
}

function sanitizeFileName(value: string) {
  const baseName = value.split(/[\\/]/).at(-1) ?? "";
  return baseName
    .normalize("NFKC")
    .replace(/[\u0000-\u001f\u007f]/g, "")
    .replace(/[<>:"|?*]/g, "_")
    .trim()
    .slice(0, 150);
}

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
  const titleValue = formData?.get("title");
  const descriptionValue = formData?.get("description");
  const categoryValue = formData?.get("category");
  const file = formData?.get("file");

  if (typeof titleValue !== "string" || titleValue.trim().length < 3 || titleValue.trim().length > 100) {
    return NextResponse.json({ message: "Judul berkas harus berisi 3–100 karakter." }, { status: 400 });
  }
  if (typeof descriptionValue !== "string" || descriptionValue.trim().length > 500) {
    return NextResponse.json({ message: "Deskripsi maksimal 500 karakter." }, { status: 400 });
  }
  if (typeof categoryValue !== "string" || !isDownloadCategory(categoryValue)) {
    return NextResponse.json({ message: "Pilih kategori data yang tersedia." }, { status: 400 });
  }
  if (!(file instanceof File)) {
    return NextResponse.json({ message: "Pilih berkas XLSX, JSON, atau CSV." }, { status: 400 });
  }
  if (file.size === 0 || file.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json({ message: "Ukuran file harus lebih dari 0 dan maksimal 5 MB." }, { status: 413 });
  }

  const fileName = sanitizeFileName(file.name);
  const extension = fileName.split(".").at(-1)?.toLowerCase() ?? "";
  const contentType = contentTypeByExtension[extension];
  if (!contentType) {
    return NextResponse.json({ message: "Format berkas harus XLSX, JSON, atau CSV." }, { status: 400 });
  }

  try {
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const fileRef = firestore.collection("downloadFiles").doc();
    const batch = firestore.batch();

    batch.create(fileRef, {
      title: titleValue.trim(),
      description: descriptionValue.trim(),
      category: categoryValue,
      fileName,
      contentType,
      size: fileBuffer.byteLength,
      uploadedBy: user.uid,
      createdAt: FieldValue.serverTimestamp(),
    });

    for (let offset = 0, index = 0; offset < fileBuffer.length; offset += CHUNK_BYTES, index += 1) {
      const chunk = fileBuffer.subarray(offset, Math.min(offset + CHUNK_BYTES, fileBuffer.length));
      batch.create(fileRef.collection("chunks").doc(String(index).padStart(4, "0")), {
        index,
        content: chunk.toString("base64"),
      });
    }

    await batch.commit();
    return NextResponse.json({ ok: true, id: fileRef.id }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json(
      { message: "Berkas belum dapat disimpan. Periksa koneksi Firestore dan coba lagi." },
      { status: 503 },
    );
  }
}
