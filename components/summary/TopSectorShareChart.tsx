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
import { sectorKeys, type SectorKey } from "@/types/sectorkey";
import { useDashboardData } from "@/components/DashboardDataContext";

const sectorLabels: Record<SectorKey, string> = {
  A: "Pertanian",
  B: "Pertambangan",
  C: "Industri",
  D: "Listrik & gas",
  E: "Air & limbah",
  F: "Konstruksi",
  G: "Perdagangan",
  H: "Transportasi",
  I: "Akomodasi",
  J: "Informasi & kom.",
  K: "Keuangan",
  L: "Real estat",
  MN: "Jasa perusahaan",
  O: "Administrasi",
  P: "Pendidikan",
  Q: "Kesehatan",
  RSTU: "Jasa lainnya",
};

const formatShare = (value: number) =>
  `${new Intl.NumberFormat("id-ID", { maximumFractionDigits: 1 }).format(value)}%`;

const tooltipStyle = {
  backgroundColor: "var(--card)",
  border: "1px solid rgba(139, 92, 246, 0.28)",
  borderRadius: "12px",
  boxShadow: "0 10px 25px rgba(76, 29, 149, 0.12)",
};

const TopSectorShareChart = ({ referenceYear }: { referenceYear: number }) => {
  const { pdrbLu: dataPdrb } = useDashboardData();
  const currentYear = dataPdrb.find((item) => item.Tahun === referenceYear);
  const topSectors = currentYear && currentYear.PDRB > 0
    ? sectorKeys
        .map((code) => ({
          code,
          sharePercent: (currentYear[code] / currentYear.PDRB) * 100,
          chartLabel: sectorLabels[code],
        }))
        .sort((a, b) => b.sharePercent - a.sharePercent)
        .slice(0, 5)
        .map((sector, index) => ({
          ...sector,
          rank: index + 1,
          chartLabel: `#${index + 1} ${sector.chartLabel}`,
        }))
    : [];

  return (
  <Card className="h-[15rem] min-h-0 min-w-0 gap-2 border-violet-200 bg-violet-50 py-3 transition-all hover:-translate-y-0.5 hover:border-violet-300 hover:shadow-md dark:border-violet-900/60 dark:bg-violet-950/40 dark:hover:border-violet-700 lg:h-full">
    <CardHeader className="shrink-0 gap-1 px-4 pt-2 pb-0">
      <CardTitle className="text-sm text-violet-950 dark:text-violet-100 sm:text-base">
        5 Sektor dengan Pangsa Terbesar terhadap PDRB
      </CardTitle>
      <CardDescription className="text-violet-700 dark:text-violet-300">
        Kabupaten Merangin · {referenceYear}
      </CardDescription>
    </CardHeader>
    <CardContent className="min-h-0 flex-1 px-2 sm:px-3">
      {topSectors.length > 0 ? (
        <div className="h-full min-h-0 w-full min-w-0" role="img" aria-label={`Lima sektor dengan pangsa terbesar terhadap PDRB tahun ${referenceYear}, diurutkan dari terbesar`}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={topSectors}
              margin={{ top: 4, right: 34, bottom: 4, left: 0 }}
              barCategoryGap={6}
            >
              <defs>
                <linearGradient id="top-sector-share" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#c4b5fd" stopOpacity={0.72} />
                  <stop offset="100%" stopColor="#7c3aed" stopOpacity={0.94} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#c4b5fd" strokeOpacity={0.2} vertical horizontal={false} />
              <XAxis
                type="number"
                domain={[0, "dataMax + 8"]}
                tickFormatter={(value) => `${Number(value).toFixed(0)}%`}
                tick={{ fill: "#6d28d9", fontSize: 11 }}
                axisLine={{ stroke: "#8b5cf6", strokeOpacity: 0.35 }}
                tickLine={{ stroke: "#8b5cf6", strokeOpacity: 0.35 }}
              />
              <YAxis
                type="category"
                dataKey="chartLabel"
                width={112}
                tick={{ fill: "#6d28d9", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={{ fill: "rgba(139, 92, 246, 0.08)" }}
                contentStyle={tooltipStyle}
                labelStyle={{ color: "var(--card-foreground)", fontWeight: 600 }}
                itemStyle={{ color: "#6d28d9" }}
                formatter={(value) => [formatShare(Number(value)), "Pangsa PDRB"]}
              />
              <Bar
                dataKey="sharePercent"
                name="Pangsa PDRB"
                fill="url(#top-sector-share)"
                radius={[0, 7, 7, 0]}
                maxBarSize={34}
                animationDuration={550}
                animationEasing="ease-out"
              >
                <LabelList
                  dataKey="sharePercent"
                  position="right"
                  formatter={(value) => formatShare(Number(value))}
                  fill="#5b21b6"
                  fontSize={11}
                  fontWeight={600}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="px-2 py-8 text-sm text-violet-700 dark:text-violet-300">
          Data pangsa PDRB belum tersedia.
        </p>
      )}
    </CardContent>
  </Card>
  );
};

export default TopSectorShareChart;
