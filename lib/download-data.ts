import "server-only";

import basePdrbExp from "@/data/pdrb_exp";
import basePdrbLu from "@/data/pdrb_lu";
import baseSocioeko from "@/data/socioeko";
import baseTenagaKerja from "@/data/tenagakerja.json";
import baseMap from "@/data/jambi_kecamatan.json";
import { DOWNLOAD_DATASETS } from "@/lib/download-catalog";
import { firestore } from "@/lib/firebase-admin";
import type { DashboardYearRecord, DemographyYearItem } from "@/types/dashboard-data";
import type { PdrbExpItem } from "@/types/pdrb_exp";
import type { PdrbLuItem } from "@/types/pdrb_lu";
import type { SocekoItem } from "@/types/socioeko";
import type { TenagaKerjaItem } from "@/types/tenagakerja";
import { TENAGA_KERJA_HEADERS } from "@/types/tenagakerja";
import type {
  DownloadDatasetId,
  DownloadDatasetSummary,
  DownloadFileCategory,
  UploadedDownloadFile,
} from "@/types/downloads";

type DashboardExportData = {
  "pdrb-lapangan-usaha": PdrbLuItem[];
  "pdrb-pengeluaran": PdrbExpItem[];
  "sosial-ekonomi": SocekoItem[];
  "ketenagakerjaan": TenagaKerjaItem[];
  "demografi-kecamatan": DemographyYearItem[];
};

type MapTopologyLike = {
  objects: Record<string, {
    geometries?: Array<{ properties?: Record<string, unknown> }>;
  }>;
};

const topology = baseMap as unknown as MapTopologyLike;

function mergeByYear<T extends { Tahun: number }>(baseRows: T[], uploadedRows: T[]) {
  const rowsByYear = new Map(baseRows.map((row) => [row.Tahun, row]));
  for (const row of uploadedRows) rowsByYear.set(row.Tahun, row);
  return [...rowsByYear.values()].sort((left, right) => left.Tahun - right.Tahun);
}

function asFiniteNumber(value: unknown) {
  const number = typeof value === "number" ? value : Number(value);
  return Number.isFinite(number) ? number : null;
}

function getBaseDemographyRows(): DemographyYearItem[] {
  return Object.values(topology.objects)
    .flatMap((object) => object.geometries ?? [])
    .flatMap(({ properties }) => {
      const name = properties?.nmkec;
      const year = asFiniteNumber(properties?.periode ?? properties?.Tahun);
      const jumlah = asFiniteNumber(properties?.Jumlah_Pen);
      const growth = asFiniteNumber(properties?.Laju_Pertu);
      const percentage = asFiniteNumber(properties?.Persentase);
      const density = asFiniteNumber(properties?.Kepadata_);
      const ratio = asFiniteNumber(properties?.Rasio_Jeni);

      if (
        typeof name !== "string" || year === null || jumlah === null || growth === null ||
        percentage === null || density === null || ratio === null
      ) return [];

      return [{
        Tahun: year,
        Kecamatan: name,
        Jumlah_Pen: jumlah,
        Laju_Pertu: growth,
        Persentase: percentage,
        Kepadata_: density,
        Rasio_Jeni: ratio,
      }];
    });
}

async function getDashboardExportData(): Promise<DashboardExportData> {
  const [snapshot, laborSnapshot] = await Promise.all([
    firestore.collection("dashboardData").get(),
    firestore.collection("laborData").get(),
  ]);
  const uploadedRecords: DashboardYearRecord[] = [];
  const demographyByYear = new Map<number, DemographyYearItem[]>();
  const uploadedLabor: TenagaKerjaItem[] = laborSnapshot.docs.flatMap((document) => {
    const data = document.data();
    if (
      typeof data.Tahun !== "number" ||
      !TENAGA_KERJA_HEADERS.every((header) => typeof data[header] === "number")
    ) return [];

    return [Object.fromEntries(
      TENAGA_KERJA_HEADERS.map((header) => [header, data[header]]),
    ) as unknown as TenagaKerjaItem];
  });

  for (const document of snapshot.docs) {
    const data = document.data();
    if (typeof data.Tahun !== "number") continue;

    if (data.pdrbLu && data.pdrbExp && data.socioeko) {
      uploadedRecords.push({
        Tahun: data.Tahun,
        pdrbLu: data.pdrbLu as PdrbLuItem,
        pdrbExp: data.pdrbExp as PdrbExpItem,
        socioeko: data.socioeko as SocekoItem,
        ...(Array.isArray(data.demografi)
          ? { demografi: data.demografi as DemographyYearItem[] }
          : {}),
      });
    }

    if (Array.isArray(data.demografi) && data.demografi.length > 0) {
      demographyByYear.set(data.Tahun, data.demografi as DemographyYearItem[]);
    }
  }

  const baseDemographyByYear = new Map<number, DemographyYearItem[]>();
  for (const row of getBaseDemographyRows()) {
    const rows = baseDemographyByYear.get(row.Tahun) ?? [];
    rows.push(row);
    baseDemographyByYear.set(row.Tahun, rows);
  }
  for (const [year, rows] of baseDemographyByYear) {
    if (!demographyByYear.has(year)) demographyByYear.set(year, rows);
  }

  return {
    "pdrb-lapangan-usaha": mergeByYear(
      basePdrbLu,
      uploadedRecords.map(({ pdrbLu }) => pdrbLu),
    ),
    "pdrb-pengeluaran": mergeByYear(
      basePdrbExp,
      uploadedRecords.map(({ pdrbExp }) => pdrbExp),
    ),
    "sosial-ekonomi": mergeByYear(
      baseSocioeko,
      uploadedRecords.map(({ socioeko }) => socioeko),
    ),
    "ketenagakerjaan": mergeByYear(
      baseTenagaKerja as TenagaKerjaItem[],
      uploadedLabor,
    ),
    "demografi-kecamatan": [...demographyByYear.entries()]
      .sort(([left], [right]) => left - right)
      .flatMap(([, rows]) => rows)
      .sort((left, right) => left.Tahun - right.Tahun || left.Kecamatan.localeCompare(right.Kecamatan, "id")),
  };
}

export async function getDashboardDatasetRows(datasetId: DownloadDatasetId) {
  const data = await getDashboardExportData();
  return data[datasetId];
}

export async function getDashboardDatasetSummaries(): Promise<DownloadDatasetSummary[]> {
  const data = await getDashboardExportData();

  return DOWNLOAD_DATASETS.map(({ id }) => {
    const rows = data[id];
    const years = [...new Set(rows.map(({ Tahun }) => Tahun))].sort((left, right) => left - right);
    const yearRange = years.length === 0
      ? "Belum tersedia"
      : years.length === 1
        ? String(years[0])
        : `${years[0]}–${years[years.length - 1]}`;

    return { id, rowCount: rows.length, yearRange, years };
  });
}

function isDownloadCategory(value: unknown): value is DownloadFileCategory {
  return value === "Ekonomi" || value === "Sosial" || value === "Demografi" || value === "Lainnya";
}

export async function getUploadedDownloadFiles(): Promise<UploadedDownloadFile[]> {
  const snapshot = await firestore
    .collection("downloadFiles")
    .orderBy("createdAt", "desc")
    .limit(100)
    .get();

  return snapshot.docs.flatMap((document) => {
    const data = document.data();
    if (
      typeof data.title !== "string" || typeof data.fileName !== "string" ||
      typeof data.contentType !== "string" || typeof data.size !== "number" ||
      !isDownloadCategory(data.category)
    ) return [];

    const createdAt = data.createdAt?.toDate?.();
    return [{
      id: document.id,
      title: data.title,
      description: typeof data.description === "string" ? data.description : "",
      category: data.category,
      fileName: data.fileName,
      contentType: data.contentType,
      size: data.size,
      createdAt: createdAt instanceof Date ? createdAt.toISOString() : "",
    }];
  });
}
