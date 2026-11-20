"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboardData } from "@/components/DashboardDataContext";
import { ExpKeys, type ExpKey } from "@/types/expkey";
import { sectorKeys, type SectorKey } from "@/types/sectorkey";

type PdrbType = "pengeluaran" | "lapangan-usaha";

interface PdrbBreakdownChartProps {
  pdrbType: PdrbType;
  referenceYear: number;
}

interface BreakdownItem {
  label: string;
  value: number;
}

const sectorLabels: Record<SectorKey, string> = {
  A: "Pertanian",
  B: "Pertambangan",
  C: "Industri pengolahan",
  D: "Listrik dan gas",
  E: "Air dan limbah",
  F: "Konstruksi",
  G: "Perdagangan",
  H: "Transportasi",
  I: "Akomodasi",
  J: "Informasi & kom.",
  K: "Jasa keuangan",
  L: "Real estat",
  MN: "Jasa perusahaan",
  O: "Administrasi",
  P: "Pendidikan",
  Q: "Kesehatan & sosial",
  RSTU: "Jasa lainnya",
};

const expenditureLabels: Record<ExpKey, string> = {
  KonsumsiRumahTangga: "Konsumsi RT",
  KonsumsiLNPRT: "Konsumsi LNPRT",
  KonsumsiPemerintah: "Konsumsi pem.",
  PMTB: "PMTB",
  PerubahanInventori: "Inventori",
  Ekspor: "Ekspor",
  NetEkspor: "Net ekspor",
};

const formatNumber = (value: number, maximumFractionDigits = 1) =>
  new Intl.NumberFormat("id-ID", { maximumFractionDigits }).format(value);

const PdrbBreakdownChart = ({ pdrbType, referenceYear }: PdrbBreakdownChartProps) => {
  const { pdrbLu, pdrbExp } = useDashboardData();
  const isLapanganUsaha = pdrbType === "lapangan-usaha";
  const currentPdrbLu = pdrbLu.find((row) => row.Tahun === referenceYear);
  const currentPdrbExp = pdrbExp.find((row) => row.Tahun === referenceYear);

  const rankedItems: BreakdownItem[] = (isLapanganUsaha
    ? currentPdrbLu && currentPdrbLu.PDRB > 0
      ? sectorKeys
          .map((key) => ({
            label: sectorLabels[key],
            value: (currentPdrbLu[key] / currentPdrbLu.PDRB) * 100,
          }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 5)
      : []
    : currentPdrbExp
      ? ExpKeys
          .map((key) => ({
            label: expenditureLabels[key],
            value: currentPdrbExp[key] / 1000,
          }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 5)
      : []).map((item, index) => ({ ...item, label: `${index + 1}. ${item.label}` }));

  const title = isLapanganUsaha
    ? "Lima sektor dengan pangsa terbesar"
    : "Lima komponen pengeluaran terbesar";
  const description = isLapanganUsaha
    ? `Porsi terhadap total PDRB · ${referenceYear}`
    : `Nilai komponen dalam miliar rupiah · ${referenceYear}`;
  const unitLabel = isLapanganUsaha ? "Pangsa PDRB" : "Nilai komponen (miliar rupiah)";
  const formatValue = (value: number) => isLapanganUsaha
    ? `${formatNumber(value)}%`
    : formatNumber(value, 2);

  return (
    <Card className="min-h-[14rem] min-w-0 gap-2 border-violet-200/80 bg-violet-50/70 py-3 shadow-sm backdrop-blur-sm dark:border-violet-900/60 dark:bg-violet-950/35">
      <CardHeader className="gap-1 px-4 pt-2 pb-0">
        <CardTitle className="text-sm font-semibold text-violet-950 dark:text-violet-100 sm:text-base">{title}</CardTitle>
        <CardDescription className="text-violet-800/75 dark:text-violet-200/75">{description}</CardDescription>
      </CardHeader>
      <CardContent className="min-h-0 flex-1 px-2 pb-2 sm:px-3">
        {rankedItems.length > 0 ? (
          <div
            className="h-[12.5rem] min-h-0 w-full min-w-0 xl:h-[10rem]"
            role="img"
            aria-label={`${title} pada tahun ${referenceYear}`}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={rankedItems}
                layout="vertical"
                margin={{ top: 3, right: 42, bottom: 3, left: 0 }}
                barCategoryGap={7}
              >
                <defs>
                  <linearGradient id="pdrb-breakdown-lavender" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#c4b5fd" stopOpacity={0.82} />
                    <stop offset="100%" stopColor="#7c3aed" stopOpacity={0.96} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border)" strokeOpacity={0.45} horizontal={false} />
                <XAxis
                  type="number"
                  tickFormatter={(value) => isLapanganUsaha ? `${formatNumber(Number(value), 0)}%` : formatNumber(Number(value), 0)}
                  tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
                  axisLine={{ stroke: "var(--border)" }}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="label"
                  width={112}
                  tick={{ fill: "var(--foreground)", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: "rgba(139, 92, 246, 0.08)" }}
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid rgba(139, 92, 246, 0.3)",
                    borderRadius: "8px",
                    boxShadow: "0 4px 14px rgba(15, 23, 42, 0.08)",
                    backdropFilter: "blur(8px)",
                  }}
                  labelStyle={{ color: "var(--card-foreground)", fontWeight: 600 }}
                  formatter={(value) => [formatValue(Number(value)), unitLabel]}
                />
                <Bar
                  dataKey="value"
                  name={unitLabel}
                  fill="url(#pdrb-breakdown-lavender)"
                  radius={[0, 4, 4, 0]}
                  maxBarSize={22}
                  animationDuration={450}
                  animationEasing="ease-out"
                >
                  <LabelList
                    dataKey="value"
                    position="right"
                    formatter={(value) => formatValue(Number(value))}
                    fill="var(--muted-foreground)"
                    fontSize={10}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="px-2 py-8 text-sm text-muted-foreground">
            Data PDRB untuk tahun {referenceYear} belum tersedia.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default PdrbBreakdownChart;
