"use client";

import type { ExpKey } from "@/types/expkey";
import PdrbStatCards from "@/components/economics/PdrbStatCards";
import { useDashboardData } from "@/components/DashboardDataContext";

interface Props {
  selectedPdrbExp: ExpKey;
  referenceYear: number;
}

const categoryLabels: Record<ExpKey, string> = {
  KonsumsiRumahTangga: "Konsumsi rumah tangga",
  KonsumsiLNPRT: "Konsumsi LNPRT",
  KonsumsiPemerintah: "Konsumsi pemerintah",
  PMTB: "Pembentukan modal tetap bruto",
  PerubahanInventori: "Perubahan inventori",
  Ekspor: "Ekspor barang dan jasa",
  NetEkspor: "Net ekspor",
};

const roundToTwo = (value: number) => Math.round(value * 100) / 100;

const StatPdrb = ({ selectedPdrbExp, referenceYear }: Props) => {
  const { pdrbExp: dataPdrbExp } = useDashboardData();
  const currentYear = dataPdrbExp.find((item) => item.Tahun === referenceYear);
  const previousYear = dataPdrbExp.find((item) => item.Tahun === referenceYear - 1);

  if (!currentYear || !previousYear) return null;

  const categoryValue = currentYear[selectedPdrbExp];
  const previousCategoryValue = previousYear[selectedPdrbExp];
  const sharePercent = categoryValue === undefined ? 0 : roundToTwo((categoryValue / currentYear.PDRB) * 100);
  const sectorGrowthPercent =
    categoryValue !== undefined && previousCategoryValue !== undefined && previousCategoryValue !== 0
      ? roundToTwo(((categoryValue - previousCategoryValue) / previousCategoryValue) * 100)
      : undefined;
  const totalGrowthPercent = roundToTwo(((currentYear.PDRB - previousYear.PDRB) / previousYear.PDRB) * 100);

  return (
    <PdrbStatCards
      categoryLabel={categoryLabels[selectedPdrbExp]}
      categoryValue={categoryValue / 1000}
      sharePercent={sharePercent}
      sectorGrowthPercent={sectorGrowthPercent}
      totalGrowthPercent={totalGrowthPercent}
      referenceYear={referenceYear}
    />
  );
};

export default StatPdrb;
