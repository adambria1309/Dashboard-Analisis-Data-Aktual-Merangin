"use client";

import type { SectorKey } from "@/types/sectorkey";
import PdrbStatCards from "@/components/economics/PdrbStatCards";
import { useDashboardData } from "@/components/DashboardDataContext";

interface Props {
  selectedPdrb: SectorKey;
  referenceYear: number;
}

const roundToTwo = (value: number) => Math.round(value * 100) / 100;

const StatPdrb = ({ selectedPdrb, referenceYear }: Props) => {
  const { pdrbLu: dataPdrb } = useDashboardData();
  const currentYear = dataPdrb.find((item) => item.Tahun === referenceYear);
  const previousYear = dataPdrb.find((item) => item.Tahun === referenceYear - 1);

  if (!currentYear || !previousYear) return null;

  const categoryValue = currentYear[selectedPdrb];
  const previousCategoryValue = previousYear[selectedPdrb];
  const sharePercent = categoryValue === undefined ? 0 : roundToTwo((categoryValue / currentYear.PDRB) * 100);
  const sectorGrowthPercent =
    categoryValue !== undefined && previousCategoryValue !== undefined && previousCategoryValue !== 0
      ? roundToTwo(((categoryValue - previousCategoryValue) / previousCategoryValue) * 100)
      : undefined;
  const totalGrowthPercent = roundToTwo(((currentYear.PDRB - previousYear.PDRB) / previousYear.PDRB) * 100);

  return (
    <PdrbStatCards
      categoryLabel={"Sektor " + selectedPdrb}
      categoryValue={categoryValue}
      sharePercent={sharePercent}
      sectorGrowthPercent={sectorGrowthPercent}
      totalGrowthPercent={totalGrowthPercent}
      referenceYear={referenceYear}
    />
  );
};

export default StatPdrb;
