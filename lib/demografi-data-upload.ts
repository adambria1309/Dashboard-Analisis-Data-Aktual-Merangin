import * as XLSX from "xlsx";
import { z } from "zod";
import mapData from "@/data/jambi_kecamatan.json";
import type { DemographyYearItem } from "@/types/dashboard-data";

const MAX_YEARS_PER_UPLOAD = 50;
const MAX_DISTRICTS = 24;
const MAX_ROWS_PER_UPLOAD = MAX_YEARS_PER_UPLOAD * MAX_DISTRICTS;

export const DEMOGRAFI_UPLOAD_HEADERS = [
  "nmkec",
  "periode",
  "Jumlah_Pen",
  "Laju_Pertu",
  "Persentase",
  "Kepadata_",
  "Rasio_Jeni",
] as const;

const numericValue = z.preprocess((value) => {
  if (typeof value !== "string") return value;
  const normalized = value.trim().replace(/\s/g, "").replace(",", ".");
  return normalized ? Number(normalized) : Number.NaN;
}, z.number().finite());

const yearValue = numericValue.pipe(z.number().int().min(1900).max(2100));
const nonNegativeValue = numericValue.pipe(z.number().nonnegative());

const demografiRowSchema = z.object({
  nmkec: z.string().trim().min(2).max(80),
  periode: yearValue,
  Jumlah_Pen: nonNegativeValue,
  Laju_Pertu: numericValue,
  Persentase: numericValue.pipe(z.number().min(0).max(100)),
  Kepadata_: nonNegativeValue,
  Rasio_Jeni: numericValue.pipe(z.number().positive()),
}).passthrough();

type MapTopologyLike = {
  objects: Record<string, {
    geometries?: Array<{ properties?: Record<string, unknown> }>;
  }>;
};

const topology = mapData as unknown as MapTopologyLike;
const normalizeDistrictName = (value: string) =>
  value.trim().replace(/\s+/g, " ").toLocaleUpperCase("id-ID");
export const DEMOGRAFI_MAP_DISTRICTS = [...new Set(
  Object.values(topology.objects)
    .flatMap((object) => object.geometries ?? [])
    .map((geometry) => geometry.properties?.nmkec)
    .filter((name): name is string => typeof name === "string"),
)];
const districtNames = new Map(DEMOGRAFI_MAP_DISTRICTS.map((name) => [normalizeDistrictName(name), name]));

export class DemografiDataUploadError extends Error {}

function getValidationMessage(error: z.ZodError) {
  const issue = error.issues[0];
  const path = issue?.path.join(" → ");
  return path ? `${path}: ${issue.message}` : issue?.message ?? "Struktur data tidak valid.";
}

function parseJsonRows(buffer: Buffer): unknown {
  let payload: unknown;
  try {
    payload = JSON.parse(buffer.toString("utf8").replace(/^\uFEFF/, ""));
  } catch {
    throw new DemografiDataUploadError("File JSON tidak dapat dibaca. Periksa sintaksnya.");
  }

  if (Array.isArray(payload)) return payload;
  if (payload && typeof payload === "object" && "demografi" in payload) {
    return (payload as { demografi: unknown }).demografi;
  }
  throw new DemografiDataUploadError('JSON harus berupa array data atau objek dengan array "demografi".');
}

function parseWorkbookRows(buffer: Buffer): unknown {
  let workbook: XLSX.WorkBook;
  try {
    workbook = XLSX.read(buffer, { type: "buffer", raw: true, cellDates: false });
  } catch {
    throw new DemografiDataUploadError("File Excel tidak dapat dibaca. Gunakan workbook XLSX yang valid.");
  }

  if (workbook.SheetNames.length === 0) {
    throw new DemografiDataUploadError("Workbook Excel tidak memiliki sheet data.");
  }

  const sheetName = workbook.SheetNames.find((name) => name.trim().toLocaleLowerCase("id-ID") === "demografi")
    ?? (workbook.SheetNames.length === 1 ? workbook.SheetNames[0] : undefined);
  if (!sheetName) {
    throw new DemografiDataUploadError('Sheet "demografi" tidak ditemukan.');
  }

  return XLSX.utils.sheet_to_json<Record<string, unknown>>(workbook.Sheets[sheetName], {
    raw: true,
    blankrows: false,
    defval: undefined,
  });
}

export function parseDemografiDataUpload(fileName: string, fileBuffer: Buffer) {
  const lowerName = fileName.toLocaleLowerCase("id-ID");
  let input: unknown;
  if (lowerName.endsWith(".json")) {
    input = parseJsonRows(fileBuffer);
  } else if (lowerName.endsWith(".xlsx")) {
    input = parseWorkbookRows(fileBuffer);
  } else {
    throw new DemografiDataUploadError("Format file harus .xlsx atau .json.");
  }

  const result = z.array(demografiRowSchema).min(1).max(MAX_ROWS_PER_UPLOAD).safeParse(input);
  if (!result.success) {
    throw new DemografiDataUploadError(getValidationMessage(result.error));
  }

  const rowsByYear = new Map<number, DemographyYearItem[]>();
  const seenDistrictsByYear = new Map<number, Set<string>>();
  for (const [index, row] of result.data.entries()) {
    const normalizedName = normalizeDistrictName(row.nmkec);
    const canonicalName = districtNames.get(normalizedName);
    if (!canonicalName) {
      throw new DemografiDataUploadError(`Baris ${index + 2}: kecamatan "${row.nmkec}" tidak ditemukan pada peta.`);
    }

    const seenDistricts = seenDistrictsByYear.get(row.periode) ?? new Set<string>();
    if (seenDistricts.has(normalizedName)) {
      throw new DemografiDataUploadError(`Kecamatan "${canonicalName}" tercantum lebih dari sekali pada ${row.periode}.`);
    }
    seenDistricts.add(normalizedName);
    seenDistrictsByYear.set(row.periode, seenDistricts);

    const yearRows = rowsByYear.get(row.periode) ?? [];
    yearRows.push({
      Tahun: row.periode,
      Kecamatan: canonicalName,
      Jumlah_Pen: row.Jumlah_Pen,
      Laju_Pertu: row.Laju_Pertu,
      Persentase: row.Persentase,
      Kepadata_: row.Kepadata_,
      Rasio_Jeni: row.Rasio_Jeni,
    });
    rowsByYear.set(row.periode, yearRows);
  }

  for (const [year, rows] of rowsByYear) {
    if (rows.length !== districtNames.size) {
      throw new DemografiDataUploadError(
        `Data ${year} harus memuat seluruh ${districtNames.size} kecamatan; saat ini ada ${rows.length}.`,
      );
    }
  }

  return [...rowsByYear.entries()]
    .sort(([left], [right]) => left - right)
    .map(([year, rows]) => ({ year, rows }));
}
