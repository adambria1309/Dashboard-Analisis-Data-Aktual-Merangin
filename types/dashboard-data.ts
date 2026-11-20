import type { PdrbExpItem } from "@/types/pdrb_exp";
import type { PdrbLuItem } from "@/types/pdrb_lu";
import type { SocekoItem } from "@/types/socioeko";

export interface DemographyYearItem {
  Tahun: number;
  Kecamatan: string;
  Jumlah_Pen: number;
  Laju_Pertu: number;
  Persentase: number;
  Kepadata_: number;
  Rasio_Jeni: number;
}

export interface DashboardYearRecord {
  Tahun: number;
  pdrbLu: PdrbLuItem;
  pdrbExp: PdrbExpItem;
  socioeko: SocekoItem;
  demografi?: DemographyYearItem[];
}
