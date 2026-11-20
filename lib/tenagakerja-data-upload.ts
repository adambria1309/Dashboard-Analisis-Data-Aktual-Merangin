import * as XLSX from "xlsx";
import { z } from "zod";
import { TENAGA_KERJA_HEADERS, type TenagaKerjaItem } from "@/types/tenagakerja";

const MAX_YEARS_PER_UPLOAD = 50;

const numericValue = z.preprocess((value) => {
  if (typeof value !== "string") return value;
  const normalized = value.trim().replace(/\s/g, "").replace(",", ".");
  return normalized ? Number(normalized) : Number.NaN;
}, z.number().finite());

const yearValue = numericValue.pipe(z.number().int().min(1900).max(2100));
const countValue = numericValue.pipe(z.number().int().nonnegative());

const laborRowSchema = z.object({
  Tahun: yearValue,
  "Angkatan Kerja Laki-Laki": countValue,
  "Angkatan Kerja Perempuan": countValue,
  "Angkatan Kerja Total": countValue,
  "Bekerja Laki-Laki": countValue,
  "Bekerja Perempuan": countValue,
  "Bekerja Total": countValue,
  "Bukan Angkatan Kerja Laki-Laki": countValue,
  "Bukan Angkatan Kerja Perempuan": countValue,
  "Bukan Angkatan Kerja Total": countValue,
  "Lainnya Laki-Laki": countValue,
  "Lainnya Perempuan": countValue,
  "Lainnya Total": countValue,
  "Mengurus Rumah Tangga Laki-Laki": countValue,
  "Mengurus Rumah Tangga Perempuan": countValue,
  "Mengurus Rumah Tangga Total": countValue,
  "PengangguranLaki-Laki": countValue,
  "Pengangguran Perempuan": countValue,
  "Pengangguran Total": countValue,
  "Sekolah Laki-Laki": countValue,
  "Sekolah Perempuan": countValue,
  "Sekolah Total": countValue,
}).strict();

export class TenagaKerjaUploadError extends Error {}

function getValidationMessage(error: z.ZodError) {
  const issue = error.issues[0];
  const path = issue?.path.join(" → ");
  return path ? `${path}: ${issue.message}` : issue?.message ?? "Struktur data tidak valid.";
}

function isBlankRow(value: unknown) {
  if (value === null || value === undefined) return true;
  if (typeof value !== "object" || Array.isArray(value)) return false;

  return Object.values(value as Record<string, unknown>).every((cell) =>
    cell === null || cell === undefined || (typeof cell === "string" && cell.trim() === ""),
  );
}

function unwrapRows(payload: unknown) {
  if (Array.isArray(payload)) return payload.filter((row) => !isBlankRow(row));
  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;
    const rows = record.tenagakerja ?? record.tenaga_kerja;
    if (Array.isArray(rows)) return rows.filter((row) => !isBlankRow(row));
  }

  throw new TenagaKerjaUploadError('JSON harus berupa array baris atau objek dengan array "tenagakerja".');
}

function parseJsonRows(buffer: Buffer) {
  let payload: unknown;
  try {
    payload = JSON.parse(buffer.toString("utf8").replace(/^\uFEFF/, ""));
  } catch {
    throw new TenagaKerjaUploadError("File JSON tidak dapat dibaca. Periksa sintaksnya.");
  }
  return unwrapRows(payload);
}

function parseWorkbookRows(buffer: Buffer) {
  let workbook: XLSX.WorkBook;
  try {
    workbook = XLSX.read(buffer, { type: "buffer", raw: true, cellDates: false });
  } catch {
    throw new TenagaKerjaUploadError("File Excel tidak dapat dibaca. Gunakan workbook XLSX yang valid.");
  }

  if (workbook.SheetNames.length === 0) {
    throw new TenagaKerjaUploadError("Workbook Excel tidak memiliki sheet data.");
  }

  const sheetName = workbook.SheetNames.find((name) =>
    ["tenagakerja", "tenaga kerja", "tenaga_kerja"].includes(name.trim().toLocaleLowerCase("id-ID")),
  ) ?? (workbook.SheetNames.length === 1 ? workbook.SheetNames[0] : undefined);
  if (!sheetName) {
    throw new TenagaKerjaUploadError('Sheet "tenagakerja" tidak ditemukan.');
  }

  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(workbook.Sheets[sheetName], {
    raw: true,
    blankrows: false,
    defval: undefined,
  });
  return rows.filter((row) => !isBlankRow(row));
}

function validateGenderTotals(row: TenagaKerjaItem, index: number) {
  const groups = [
    ["Angkatan Kerja", row["Angkatan Kerja Laki-Laki"], row["Angkatan Kerja Perempuan"], row["Angkatan Kerja Total"]],
    ["Bekerja", row["Bekerja Laki-Laki"], row["Bekerja Perempuan"], row["Bekerja Total"]],
    ["Bukan Angkatan Kerja", row["Bukan Angkatan Kerja Laki-Laki"], row["Bukan Angkatan Kerja Perempuan"], row["Bukan Angkatan Kerja Total"]],
    ["Lainnya", row["Lainnya Laki-Laki"], row["Lainnya Perempuan"], row["Lainnya Total"]],
    ["Mengurus Rumah Tangga", row["Mengurus Rumah Tangga Laki-Laki"], row["Mengurus Rumah Tangga Perempuan"], row["Mengurus Rumah Tangga Total"]],
    ["Pengangguran", row["PengangguranLaki-Laki"], row["Pengangguran Perempuan"], row["Pengangguran Total"]],
    ["Sekolah", row["Sekolah Laki-Laki"], row["Sekolah Perempuan"], row["Sekolah Total"]],
  ] as const;

  for (const [label, male, female, total] of groups) {
    if (male + female !== total) {
      throw new TenagaKerjaUploadError(
        `Baris ${index}: total ${label} pada ${row.Tahun} harus sama dengan jumlah laki-laki dan perempuan.`,
      );
    }
  }
}

export function parseTenagaKerjaUpload(fileName: string, fileBuffer: Buffer): TenagaKerjaItem[] {
  const lowerName = fileName.toLocaleLowerCase("id-ID");
  const input = lowerName.endsWith(".json")
    ? parseJsonRows(fileBuffer)
    : lowerName.endsWith(".xlsx")
      ? parseWorkbookRows(fileBuffer)
      : (() => { throw new TenagaKerjaUploadError("Format file harus .xlsx atau .json."); })();

  const result = z.array(laborRowSchema).min(1).max(MAX_YEARS_PER_UPLOAD).safeParse(input);
  if (!result.success) {
    throw new TenagaKerjaUploadError(getValidationMessage(result.error));
  }

  const seenYears = new Set<number>();
  const rows = result.data as TenagaKerjaItem[];
  for (const [index, row] of rows.entries()) {
    if (seenYears.has(row.Tahun)) {
      throw new TenagaKerjaUploadError(`Tahun ${row.Tahun} muncul lebih dari sekali.`);
    }
    seenYears.add(row.Tahun);
    validateGenderTotals(row, index + 2);
  }

  return rows.sort((left, right) => left.Tahun - right.Tahun);
}

export function createTenagaKerjaTemplateRow() {
  return Object.fromEntries(TENAGA_KERJA_HEADERS.map((header) => [header, header === "Tahun" ? 2025 : null]));
}
