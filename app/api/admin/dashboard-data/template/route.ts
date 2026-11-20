import * as XLSX from "xlsx";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { DASHBOARD_UPLOAD_HEADERS } from "@/lib/dashboard-data-upload";

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
  if (format === "json") {
    const emptyRow = (headers: readonly string[]) =>
      Object.fromEntries(headers.map((header) => [header, header === "Tahun" ? 2025 : null]));
    const template = {
      pdrb_lu: [emptyRow(DASHBOARD_UPLOAD_HEADERS.pdrb_lu)],
      pdrb_exp: [emptyRow(DASHBOARD_UPLOAD_HEADERS.pdrb_exp)],
      socioeko: [emptyRow(DASHBOARD_UPLOAD_HEADERS.socioeko)],
      demografi: [],
    };
    return new NextResponse(JSON.stringify(template, null, 2), {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Disposition": "attachment; filename=dadam-data-template.json",
        "Cache-Control": "no-store",
      },
    });
  }

  if (format !== "xlsx") {
    return NextResponse.json({ message: "Format template tidak dikenal." }, { status: 400 });
  }

  const workbook = XLSX.utils.book_new();
  for (const [sheetName, headers] of Object.entries(DASHBOARD_UPLOAD_HEADERS)) {
    const worksheet = XLSX.utils.aoa_to_sheet([[...headers]]);
    worksheet["!cols"] = headers.map((header) => ({ wch: Math.max(header.length + 2, 14) }));
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  }

  const output = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
  return new NextResponse(output, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": "attachment; filename=dadam-data-template.xlsx",
      "Cache-Control": "no-store",
    },
  });
}
