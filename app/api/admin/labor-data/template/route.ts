import * as XLSX from "xlsx";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { createTenagaKerjaTemplateRow } from "@/lib/tenagakerja-data-upload";
import { TENAGA_KERJA_HEADERS } from "@/types/tenagakerja";

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
  const templateRow = createTenagaKerjaTemplateRow();
  if (format === "json") {
    return new NextResponse(JSON.stringify({ tenagakerja: [templateRow] }, null, 2), {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Disposition": "attachment; filename=dadam-tenagakerja-template.json",
        "Cache-Control": "no-store",
      },
    });
  }
  if (format !== "xlsx") {
    return NextResponse.json({ message: "Format template tidak dikenal." }, { status: 400 });
  }

  const worksheet = XLSX.utils.aoa_to_sheet([
    [...TENAGA_KERJA_HEADERS],
    TENAGA_KERJA_HEADERS.map((header) => templateRow[header]),
  ]);
  worksheet["!cols"] = TENAGA_KERJA_HEADERS.map((header) => ({ wch: Math.max(header.length + 2, 14) }));
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "tenagakerja");
  const output = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
  return new NextResponse(output, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": "attachment; filename=dadam-tenagakerja-template.xlsx",
      "Cache-Control": "no-store",
    },
  });
}
