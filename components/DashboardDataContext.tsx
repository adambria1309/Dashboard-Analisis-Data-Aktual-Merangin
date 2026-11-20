"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import basePdrbExp from "@/data/pdrb_exp";
import basePdrbLu from "@/data/pdrb_lu";
import baseSocioeko from "@/data/socioeko";
import baseTenagaKerja from "@/data/tenagakerja.json";
import type { DashboardYearRecord, DemographyYearItem } from "@/types/dashboard-data";
import type { TenagaKerjaItem } from "@/types/tenagakerja";
import type { PdrbExpItem } from "@/types/pdrb_exp";
import type { PdrbLuItem } from "@/types/pdrb_lu";
import type { SocekoItem } from "@/types/socioeko";

interface DashboardDataContextValue {
  pdrbLu: PdrbLuItem[];
  pdrbExp: PdrbExpItem[];
  socioeko: SocekoItem[];
  tenagakerja: TenagaKerjaItem[];
  demografiByYear: Map<number, DemographyYearItem[]>;
  isReady: boolean;
}

const DashboardDataContext = createContext<DashboardDataContextValue | null>(null);

function mergeByYear<T extends { Tahun: number }>(baseRows: T[], uploadedRows: T[]) {
  const rowsByYear = new Map(baseRows.map((row) => [row.Tahun, row]));
  for (const row of uploadedRows) rowsByYear.set(row.Tahun, row);
  return [...rowsByYear.values()].sort((a, b) => a.Tahun - b.Tahun);
}

export function getReferenceYears(data: Pick<DashboardDataContextValue, "pdrbLu" | "pdrbExp" | "socioeko">) {
  const pdrbLuYears = new Set(data.pdrbLu.map(({ Tahun }) => Tahun));
  const pdrbExpYears = new Set(data.pdrbExp.map(({ Tahun }) => Tahun));

  return [...new Set(data.socioeko.map(({ Tahun }) => Tahun))]
    .filter((year) => pdrbLuYears.has(year) && pdrbExpYears.has(year))
    .sort((a, b) => a - b);
}

export const DEFAULT_REFERENCE_YEAR =
  getReferenceYears({ pdrbLu: basePdrbLu, pdrbExp: basePdrbExp, socioeko: baseSocioeko }).at(-1) ?? 0;

export function DashboardDataProvider({
  children,
  enabled,
}: {
  children: ReactNode;
  enabled: boolean;
}) {
  const [uploadedRecords, setUploadedRecords] = useState<DashboardYearRecord[]>([]);
  const [uploadedTenagaKerja, setUploadedTenagaKerja] = useState<TenagaKerjaItem[]>([]);
  const [uploadedDemografiByYear, setUploadedDemografiByYear] = useState<Array<{
    Tahun: number;
    demografi: DemographyYearItem[];
  }>>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    let active = true;

    fetch("/api/dashboard/data", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("Data dashboard tidak dapat dimuat.");
        return response.json() as Promise<{
          records?: DashboardYearRecord[];
          demografiByYear?: Array<{ Tahun: number; demografi: DemographyYearItem[] }>;
          tenagakerja?: TenagaKerjaItem[];
        }>;
      })
      .then((result) => {
        if (!active) return;
        setUploadedRecords(Array.isArray(result.records) ? result.records : []);
        setUploadedTenagaKerja(Array.isArray(result.tenagakerja) ? result.tenagakerja : []);
        setUploadedDemografiByYear(Array.isArray(result.demografiByYear) ? result.demografiByYear : []);
      })
      .catch(() => {
        if (!active) return;
        setUploadedRecords([]);
        setUploadedTenagaKerja([]);
        setUploadedDemografiByYear([]);
      })
      .finally(() => {
        if (active) setIsReady(true);
      });

    return () => {
      active = false;
    };
  }, [enabled]);

  const value = useMemo<DashboardDataContextValue>(() => {
    const demografiByYear = new Map<number, DemographyYearItem[]>();
    for (const record of uploadedRecords) {
      if (record.demografi?.length) demografiByYear.set(record.Tahun, record.demografi);
    }
    for (const record of uploadedDemografiByYear) {
      if (record.demografi?.length) demografiByYear.set(record.Tahun, record.demografi);
    }

    return {
      pdrbLu: mergeByYear(basePdrbLu, uploadedRecords.map(({ pdrbLu }) => pdrbLu)),
      pdrbExp: mergeByYear(basePdrbExp, uploadedRecords.map(({ pdrbExp }) => pdrbExp)),
      socioeko: mergeByYear(baseSocioeko, uploadedRecords.map(({ socioeko }) => socioeko)),
      tenagakerja: mergeByYear(
        baseTenagaKerja as TenagaKerjaItem[],
        uploadedTenagaKerja,
      ),
      demografiByYear,
      isReady,
    };
  }, [uploadedRecords, uploadedTenagaKerja, uploadedDemografiByYear, isReady]);

  return (
    <DashboardDataContext.Provider value={value}>
      {children}
    </DashboardDataContext.Provider>
  );
}

export function useDashboardData() {
  const context = useContext(DashboardDataContext);
  if (!context) {
    throw new Error("useDashboardData must be used within DashboardDataProvider");
  }
  return context;
}
