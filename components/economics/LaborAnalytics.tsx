"use client";

import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { useDashboardData } from "@/components/DashboardDataContext";
import { useReferenceYear } from "@/components/ReferenceYearContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const peopleFormatter = new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 });
const decimalFormatter = new Intl.NumberFormat("id-ID", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const percentFormatter = new Intl.NumberFormat("id-ID", { maximumFractionDigits: 2 });

const formatPeople = (value: number) => peopleFormatter.format(value);
const formatDecimal = (value: number) => decimalFormatter.format(value);
const formatPercent = (value: number) => `${percentFormatter.format(Math.abs(value))}%`;
const describeChange = (value: number) =>
  `${value > 0 ? "naik" : value < 0 ? "turun" : "tetap"} ${formatPercent(value)}`;

const compareChanges = (pdrbChange: number | undefined, employmentChange: number | undefined) => {
  if (pdrbChange === undefined || employmentChange === undefined) {
    return "Data pembanding PDRB atau jumlah bekerja belum lengkap.";
  }

  if (pdrbChange >= 0 && employmentChange >= 0) {
    if (employmentChange > pdrbChange) return "Jumlah bekerja bertambah lebih cepat daripada PDRB.";
    if (pdrbChange > employmentChange) return "PDRB tumbuh lebih cepat daripada jumlah bekerja.";
    return pdrbChange === 0
      ? "PDRB dan jumlah bekerja tidak berubah."
      : "PDRB dan jumlah bekerja tumbuh pada tingkat yang sama.";
  }

  if (pdrbChange < 0 && employmentChange < 0) {
    if (employmentChange < pdrbChange) return "Jumlah bekerja turun lebih dalam daripada PDRB.";
    if (pdrbChange < employmentChange) return "PDRB turun lebih dalam daripada jumlah bekerja.";
    return "PDRB dan jumlah bekerja turun pada tingkat yang sama.";
  }

  if (pdrbChange >= 0) {
    return `PDRB ${pdrbChange === 0 ? "tetap" : "meningkat"} saat jumlah bekerja menurun.`;
  }

  return `PDRB menurun saat jumlah bekerja ${employmentChange === 0 ? "tetap" : "bertambah"}.`;
};

const genderColors = {
  male: "#f97316",
  female: "#64748b",
};

const LaborAnalytics = () => {
  const { referenceYear } = useReferenceYear();
  const { pdrbLu, tenagakerja } = useDashboardData();
  const laborData = tenagakerja;
  const latestLaborYear = laborData.at(-1)?.Tahun ?? referenceYear;
  const currentYear = laborData.find((row) => row.Tahun === referenceYear);
  const previousYear = laborData.find((row) => row.Tahun === referenceYear - 1);
  const currentPdrb = pdrbLu.find((row) => row.Tahun === referenceYear);
  const previousPdrb = pdrbLu.find((row) => row.Tahun === referenceYear - 1);

  const maleWorkers = currentYear?.["Bekerja Laki-Laki"] ?? 0;
  const femaleWorkers = currentYear?.["Bekerja Perempuan"] ?? 0;
  const totalWorkers = currentYear?.["Bekerja Total"] ?? 0;
  const employmentChange = previousYear && previousYear["Bekerja Total"] > 0
    ? ((totalWorkers - previousYear["Bekerja Total"]) / previousYear["Bekerja Total"]) * 100
    : undefined;
  const productivity = currentPdrb && totalWorkers > 0
    ? (currentPdrb.PDRB * 1000) / totalWorkers
    : undefined;
  const previousProductivity = previousYear && previousYear["Bekerja Total"] > 0 && previousPdrb
    ? (previousPdrb.PDRB * 1000) / previousYear["Bekerja Total"]
    : undefined;
  const productivityChange = productivity !== undefined && previousProductivity !== undefined && previousProductivity > 0
    ? ((productivity - previousProductivity) / previousProductivity) * 100
    : undefined;
  const pdrbChange = currentPdrb && previousPdrb && previousPdrb.PDRB > 0
    ? ((currentPdrb.PDRB - previousPdrb.PDRB) / previousPdrb.PDRB) * 100
    : undefined;

  const genderData = [
    { name: "Laki-laki", value: maleWorkers, color: genderColors.male },
    { name: "Perempuan", value: femaleWorkers, color: genderColors.female },
  ].filter((item) => item.value > 0);

  const comparisonNote = compareChanges(pdrbChange, employmentChange);
  const interpretation = productivityChange === undefined
    ? `Produktivitas belum dapat dibandingkan untuk ${referenceYear} karena data tenaga kerja atau PDRB tahun sebelumnya belum tersedia.`
    : `PDRB per pekerja ${describeChange(productivityChange)} dibanding ${referenceYear - 1}. PDRB ${pdrbChange === undefined ? "belum memiliki pembanding" : describeChange(pdrbChange)}, sementara jumlah bekerja ${employmentChange === undefined ? "belum memiliki pembanding" : describeChange(employmentChange)}. ${comparisonNote} Angka ini adalah rata-rata PDRB per pekerja, bukan ukuran upah.`;

  const EmploymentChangeIcon = employmentChange === undefined
    ? Minus
    : employmentChange > 0
      ? ArrowUpRight
      : employmentChange < 0
        ? ArrowDownRight
        : Minus;
  const employmentChangeClass = employmentChange === undefined
    ? "text-muted-foreground"
    : employmentChange > 0
      ? "text-emerald-700 dark:text-emerald-300"
      : employmentChange < 0
        ? "text-rose-700 dark:text-rose-300"
        : "text-muted-foreground";
  const productivityChangeClass = productivityChange === undefined
    ? "text-muted-foreground"
    : productivityChange > 0
      ? "text-emerald-700 dark:text-emerald-300"
      : productivityChange < 0
        ? "text-rose-700 dark:text-rose-300"
        : "text-muted-foreground";
  const ProductivityChangeIcon = productivityChange === undefined
    ? Minus
    : productivityChange > 0
      ? ArrowUpRight
      : productivityChange < 0
        ? ArrowDownRight
        : Minus;

  return (
    <section className="mt-8 min-w-0 border-t border-orange-200/80 pt-6 dark:border-orange-900/60" aria-labelledby="labor-analytics-title">
      <header className="mb-4">
        <h2 id="labor-analytics-title" className="text-xl font-semibold tracking-tight text-orange-950 dark:text-orange-100">
          Tenaga kerja
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Jumlah bekerja dan produktivitas pada tahun referensi {referenceYear}.
        </p>
        {latestLaborYear > referenceYear && (
          <p className="mt-1 text-xs text-muted-foreground">
            Data tenaga kerja tersedia hingga {latestLaborYear}; PDRB tahun tersebut belum tersedia untuk menghitung produktivitas.
          </p>
        )}
      </header>

      <div className="grid min-w-0 grid-cols-1 items-stretch gap-4 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.35fr)]">
        <Card className="min-w-0 gap-0 border-orange-200/80 bg-orange-50/65 py-0 shadow-sm backdrop-blur-md dark:border-orange-900/60 dark:bg-orange-950/25">
          <CardHeader className="gap-1 px-5 pt-5 pb-2">
            <CardTitle className="text-base font-semibold text-orange-950 dark:text-orange-100">
              Penduduk bekerja
            </CardTitle>
            <CardDescription className="text-orange-900/70 dark:text-orange-200/70">Komposisi menurut jenis kelamin · {referenceYear}</CardDescription>
          </CardHeader>
          <CardContent className="px-5 pb-4">
            {currentYear && totalWorkers > 0 ? (
              <>
                <div
                  className="relative h-48 w-full min-w-0"
                  role="img"
                  aria-label={`Komposisi ${formatPeople(totalWorkers)} penduduk bekerja pada ${referenceYear}: ${formatPeople(maleWorkers)} laki-laki dan ${formatPeople(femaleWorkers)} perempuan`}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={genderData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius="62%"
                        outerRadius="84%"
                        paddingAngle={2}
                        stroke="var(--card)"
                        strokeWidth={2}
                        animationDuration={500}
                        animationEasing="ease-out"
                      >
                        {genderData.map((entry) => (
                          <Cell key={entry.name} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value, name) => [`${formatPeople(Number(value))} orang`, name]}
                        contentStyle={{
                          backgroundColor: "var(--card)",
                          border: "1px solid rgba(249, 115, 22, 0.3)",
                          borderRadius: "8px",
                          boxShadow: "0 4px 14px rgba(15, 23, 42, 0.08)",
                          backdropFilter: "blur(8px)",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xs text-muted-foreground">Total bekerja</span>
                    <strong className="mt-0.5 text-lg font-semibold tabular-nums text-foreground">
                      {formatPeople(totalWorkers)}
                    </strong>
                    <span className="text-xs text-muted-foreground">orang</span>
                  </div>
                </div>

                <dl className="divide-y divide-orange-200/70 dark:divide-orange-900/50">
                  {genderData.map((item) => (
                    <div key={item.name} className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-3 py-2.5 text-sm">
                      <dt className="flex min-w-0 items-center gap-2 text-muted-foreground">
                        <span aria-hidden="true" className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
                        {item.name}
                      </dt>
                      <dd className="font-medium tabular-nums text-foreground">{formatPeople(item.value)}</dd>
                      <dd className="w-14 text-right tabular-nums text-muted-foreground">
                        {formatPercent((item.value / totalWorkers) * 100)}
                      </dd>
                    </div>
                  ))}
                </dl>
              </>
            ) : (
              <p className="py-12 text-center text-sm text-muted-foreground">
                Data tenaga kerja untuk {referenceYear} belum tersedia.
              </p>
            )}
          </CardContent>
          <CardFooter className="justify-between gap-3 border-t border-orange-200/70 px-5 pt-3 pb-4 dark:border-orange-900/50">
            <span className="text-sm text-muted-foreground">Perubahan jumlah bekerja</span>
            {employmentChange === undefined ? (
              <span className="text-sm text-muted-foreground">Data pembanding belum tersedia</span>
            ) : (
              <span className={`inline-flex shrink-0 items-center font-semibold tabular-nums ${employmentChangeClass}`}>
                <EmploymentChangeIcon aria-hidden="true" className="mr-1 size-4" />
                {employmentChange > 0 ? "+" : ""}{percentFormatter.format(employmentChange)}%
                <span className="ml-1 font-normal text-muted-foreground">dari {referenceYear - 1}</span>
              </span>
            )}
          </CardFooter>
        </Card>

        <div className="grid min-w-0 grid-cols-1 gap-4">
          <Card className="min-h-[13rem] min-w-0 gap-0 border-orange-200/80 bg-orange-50/65 py-0 shadow-sm backdrop-blur-md dark:border-orange-900/60 dark:bg-orange-950/25 xl:min-h-[14rem]">
            <CardHeader className="gap-3 px-5 pt-5 pb-2">
              <CardTitle className="text-base font-semibold text-orange-950 dark:text-orange-100">
                Produktivitas tenaga kerja
              </CardTitle>
              <CardDescription className="text-orange-900/70 dark:text-orange-200/70">PDRB lapangan usaha dibagi jumlah bekerja · {referenceYear}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col justify-between gap-6 px-5 pt-3 pb-5">
              <div>
                <p className="text-4xl font-semibold leading-none tracking-tight tabular-nums text-orange-950 dark:text-orange-100">
                  {productivity === undefined ? "—" : formatDecimal(productivity)}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">juta rupiah per pekerja per tahun</p>
              </div>
              {productivityChange === undefined ? (
                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-orange-200/70 pt-3 text-sm dark:border-orange-900/50">
                  <span className="text-muted-foreground">Perubahan tahunan</span>
                  <span className="text-muted-foreground">Data pembanding belum lengkap</span>
                </div>
              ) : (
                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-orange-200/70 pt-3 text-sm dark:border-orange-900/50">
                  <span className="text-muted-foreground">Perubahan dari {referenceYear - 1}</span>
                  <span className={`inline-flex items-center font-medium ${productivityChangeClass}`}>
                    <ProductivityChangeIcon aria-hidden="true" className="mr-1 size-4" />
                    {productivityChange > 0 ? "Naik" : productivityChange < 0 ? "Turun" : "Tetap"} {formatPercent(productivityChange)}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="min-h-[13rem] min-w-0 gap-0 border-orange-200/80 bg-orange-50/65 py-0 shadow-sm backdrop-blur-md dark:border-orange-900/60 dark:bg-orange-950/25 xl:min-h-[14rem]">
            <CardHeader className="gap-3 px-5 pt-5 pb-2">
              <CardTitle className="text-base font-semibold text-orange-950 dark:text-orange-100">Interpretasi</CardTitle>
              <CardDescription className="text-orange-900/70 dark:text-orange-200/70">Perubahan produktivitas dibandingkan tahun sebelumnya</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-1 items-center px-5 pt-3 pb-5">
              <p className="max-w-prose text-sm leading-7 text-muted-foreground">{interpretation}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default LaborAnalytics;
