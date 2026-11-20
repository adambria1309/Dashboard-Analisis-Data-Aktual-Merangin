import * as XLSX from "xlsx";
import { z } from "zod";
import dataMap from "@/data/jambi_kecamatan.json";
import type { DashboardYearRecord, DemographyYearItem } from "@/types/dashboard-data";

const MAX_YEARS_PER_UPLOAD = 50;
const MAX_DISTRICTS = 24;

export const DASHBOARD_UPLOAD_HEADERS = {
  pdrb_lu: [
    "Tahun", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "MN", "O", "P", "Q", "RSTU", "PDRB",
  ],
  pdrb_exp: [
    "Tahun", "KonsumsiRumahTangga", "KonsumsiLNPRT", "KonsumsiPemerintah", "PMTB", "PerubahanInventori", "Ekspor", "NetEkspor", "PDRB",
  ],
  socioeko: ["Tahun", "TPT", "Gini", "P0", "PE"],
  demografi: ["Tahun", "Kecamatan", "Jumlah_Pen", "Laju_Pertu", "Persentase", "Kepadata_", "Rasio_Jeni"],
} as const;

export class DashboardUploadError extends Error {}

const numericValue = z.preprocess((value) => {
  if (typeof value !== "string") return value;
  const normalized = value.trim().replace(/\s/g, "").replace(",", ".");
  return normalized ? Number(normalized) : Number.NaN;
}, z.number().finite());

const yearValue = numericValue.pipe(z.number().int().min(1900).max(2100));
const nonNegativeValue = numericValue.pipe(z.number().nonnegative());

const pdrbLuSchema = z.object({
  Tahun: yearValue,
  A: nonNegativeValue,
  B: nonNegativeValue,
  C: nonNegativeValue,
  D: nonNegativeValue,
  E: nonNegativeValue,
  F: nonNegativeValue,
  G: nonNegativeValue,
  H: nonNegativeValue,
  I: nonNegativeValue,
  J: nonNegativeValue,
  K: nonNegativeValue,
  L: nonNegativeValue,
  MN: nonNegativeValue,
  O: nonNegativeValue,
  P: nonNegativeValue,
  Q: nonNegativeValue,
  RSTU: nonNegativeValue,
  PDRB: numericValue.pipe(z.number().positive()),
}).strict();

const pdrbExpSchema = z.object({
  Tahun: yearValue,
  KonsumsiRumahTangga: nonNegativeValue,
  KonsumsiLNPRT: nonNegativeValue,
  KonsumsiPemerintah: nonNegativeValue,
  PMTB: nonNegativeValue,
  PerubahanInventori: numericValue,
  Ekspor: nonNegativeValue,
  NetEkspor: numericValue,
  PDRB: numericValue.pipe(z.number().positive()),
}).strict();

const socioekoSchema = z.object({
  Tahun: yearValue,
  TPT: numericValue.pipe(z.number().min(0).max(100)),
  Gini: numericValue.pipe(z.number().min(0).max(1)),
  P0: numericValue.pipe(z.number().min(0).max(100)),
  PE: numericValue.pipe(z.number().min(-100).max(100)),
}).strict();

const demografiSchema = z.object({
  Tahun: yearValue,
  Kecamatan: z.string().trim().min(2).max(80),
  Jumlah_Pen: nonNegativeValue,
  Laju_Pertu: numericValue,
  Persentase: numericValue.pipe(z.number().min(0).max(100)),
  Kepadata_: nonNegativeValue,
  Rasio_Jeni: numericValue.pipe(z.number().positive()),
}).strict();

const uploadPayloadSchema = z.object({
  pdrb_lu: z.array(pdrbLuSchema).min(1).max(MAX_YEARS_PER_UPLOAD),
  pdrb_exp: z.array(pdrbExpSchema).min(1).max(MAX_YEARS_PER_UPLOAD),
  socioeko: z.array(socioekoSchema).min(1).max(MAX_YEARS_PER_UPLOAD),
  demografi: z.array(demografiSchema).max(MAX_YEARS_PER_UPLOAD * MAX_DISTRICTS).optional().default([]),
}).strict();

type UploadPayload = z.infer<typeof uploadPayloadSchema>;

type MapTopologyLike = {
  objects: Record<string, {
    geometries?: Array<{ properties?: Record<string, unknown> }>;
  }>;
};

const mapTopology = dataMap as unknown as MapTopologyLike;
const districtName = (value: string) => value.trim().replace(/\s+/g, " ").toLocaleUpperCase("id-ID");
const knownDistricts = new Set(
  Object.values(mapTopology.objects)
    .flatMap((object) => object.geometries ?? [])
    .map((geometry) => geometry.properties?.nmkec)
    .filter((value): value is string => typeof value === "string")
    .map(districtName),
);

function getValidationMessage(error: z.ZodError) {
  const issue = error.issues[0];
  const path = issue?.path.join(" → ");
  return path ? `${path}: ${issue.message}` : issue?.message ?? "Struktur data tidak valid.";
}

function indexByYear<T extends { Tahun: number }>(key: string, rows: T[]) {
  const rowsByYear = new Map<number, T>();
  for (const row of rows) {
    if (rowsByYear.has(row.Tahun)) {
      throw new DashboardUploadError(`${key}: tahun ${row.Tahun} muncul lebih dari sekali.`);
    }
    rowsByYear.set(row.Tahun, row);
  }
  return rowsByYear;
}

function parsePayload(input: unknown): DashboardYearRecord[] {
  const result = uploadPayloadSchema.safeParse(input);
  if (!result.success) {
    throw new DashboardUploadError(getValidationMessage(result.error));
  }

  const payload = result.data as UploadPayload;
  const pdrbLuByYear = indexByYear("pdrb_lu", payload.pdrb_lu);
  const pdrbExpByYear = indexByYear("pdrb_exp", payload.pdrb_exp);
  const socioekoByYear = indexByYear("socioeko", payload.socioeko);

  const years = [...pdrbLuByYear.keys()].sort((a, b) => a - b);
  const sameYears = (other: Map<number, unknown>) =>
    years.length === other.size && years.every((year) => other.has(year));
  if (!sameYears(pdrbExpByYear) || !sameYears(socioekoByYear)) {
    throw new DashboardUploadError(
      "Kolom Tahun pada sheet pdrb_lu, pdrb_exp, dan socioeko harus berisi tahun yang sama.",
    );
  }

  const demografiByYear = new Map<number, DemographyYearItem[]>();
  for (const row of payload.demografi) {
    if (!years.includes(row.Tahun)) {
      throw new DashboardUploadError(`demografi: tahun ${row.Tahun} tidak ada di tiga sheet wajib.`);
    }

    const normalizedName = districtName(row.Kecamatan);
    if (!knownDistricts.has(normalizedName)) {
      throw new DashboardUploadError(`demografi: kecamatan "${row.Kecamatan}" tidak ditemukan pada peta.`);
    }

    const rows = demografiByYear.get(row.Tahun) ?? [];
    if (rows.some((item) => districtName(item.Kecamatan) === normalizedName)) {
      throw new DashboardUploadError(`demografi: kecamatan "${row.Kecamatan}" tercantum ganda pada ${row.Tahun}.`);
    }
    rows.push({ ...row, Kecamatan: row.Kecamatan.trim() });
    demografiByYear.set(row.Tahun, rows);
  }

  for (const [year, rows] of demografiByYear) {
    if (rows.length !== knownDistricts.size) {
      throw new DashboardUploadError(
        `demografi ${year}: isi data untuk seluruh ${knownDistricts.size} kecamatan, saat ini ${rows.length}.`,
      );
    }
  }

  return years.map((Tahun) => {
    const demografi = demografiByYear.get(Tahun);
    return {
      Tahun,
      pdrbLu: pdrbLuByYear.get(Tahun)!,
      pdrbExp: pdrbExpByYear.get(Tahun)!,
      socioeko: socioekoByYear.get(Tahun)!,
      ...(demografi ? { demografi } : {}),
    };
  });
}

function workbookToPayload(buffer: Buffer) {
  const workbook = XLSX.read(buffer, {
    type: "buffer",
    raw: true,
    cellDates: false,
    sheetRows: MAX_YEARS_PER_UPLOAD * MAX_DISTRICTS + 1,
  });
  const sheetNames = new Map(
    workbook.SheetNames.map((name) => [name.trim().toLocaleLowerCase("id-ID"), name]),
  );

  for (const name of ["pdrb_lu", "pdrb_exp", "socioeko"] as const) {
    if (!sheetNames.has(name)) {
      throw new DashboardUploadError(`Sheet wajib "${name}" tidak ditemukan di workbook.`);
    }
  }

  const readSheet = (name: keyof typeof DASHBOARD_UPLOAD_HEADERS) => {
    const actualName = sheetNames.get(name);
    if (!actualName) return [];
    const sheet = workbook.Sheets[actualName];
    return XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
      raw: true,
      blankrows: false,
      defval: undefined,
    });
  };

  return {
    pdrb_lu: readSheet("pdrb_lu"),
    pdrb_exp: readSheet("pdrb_exp"),
    socioeko: readSheet("socioeko"),
    demografi: readSheet("demografi"),
  };
}

export function parseDashboardDataUpload(fileName: string, fileBuffer: Buffer) {
  let payload: unknown;
  if (fileName.toLocaleLowerCase("id-ID").endsWith(".json")) {
    try {
      payload = JSON.parse(fileBuffer.toString("utf8").replace(/^\uFEFF/, ""));
    } catch {
      throw new DashboardUploadError("File JSON tidak dapat dibaca. Periksa format dan tanda kutipnya.");
    }
  } else if (fileName.toLocaleLowerCase("id-ID").endsWith(".xlsx")) {
    try {
      payload = workbookToPayload(fileBuffer);
    } catch (error) {
      if (error instanceof DashboardUploadError) throw error;
      throw new DashboardUploadError("File XLSX tidak dapat dibaca. Gunakan workbook Excel yang valid.");
    }
  } else {
    throw new DashboardUploadError("Format file harus .xlsx atau .json.");
  }

  return parsePayload(payload);
}
