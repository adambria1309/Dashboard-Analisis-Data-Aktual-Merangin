import * as XLSX from "xlsx";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import {
  DEMOGRAFI_MAP_DISTRICTS,
  DEMOGRAFI_UPLOAD_HEADERS,
} from "@/lib/demografi-data-upload";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: "Silakan masuk." }, { status: 401 });
  }
  if (user.role !== "admin") {
    return NextResponse.json({ message: "Akses khusus admin." }, { status: 403 });
  }

  const format = new URL(request.url).searchParams.get("format") ?? "xlsx";
  const rows = DEMOGRAFI_MAP_DISTRICTS.map((nmkec) => ({
    nmkec,
    periode: null,
    Jumlah_Pen: null,
    Laju_Pertu: null,
    Persentase: null,
    Kepadata_: null,
    Rasio_Jeni: null,
  }));

  if (format === "json") {
    return new NextResponse(JSON.stringify({ demografi: rows }, null, 2), {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Disposition": "attachment; filename=dadam-demografi-template.json",
        "Cache-Control": "no-store",
      },
    });
  }
  if (format !== "xlsx") {
    return NextResponse.json({ message: "Format template tidak dikenal." }, { status: 400 });
  }

  const worksheet = XLSX.utils.aoa_to_sheet([
    [...DEMOGRAFI_UPLOAD_HEADERS],
    ...rows.map((row) => DEMOGRAFI_UPLOAD_HEADERS.map((header) => row[header])),
  ]);
  worksheet["!cols"] = DEMOGRAFI_UPLOAD_HEADERS.map((header) => ({ wch: Math.max(header.length + 2, 14) }));
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "demografi");
  const output = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
  return new NextResponse(output, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": "attachment; filename=dadam-demografi-template.xlsx",
      "Cache-Control": "no-store",
    },
  });
}
