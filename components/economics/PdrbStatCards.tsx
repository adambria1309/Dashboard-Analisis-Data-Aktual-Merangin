import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface PdrbStatCardsProps {
  referenceYear: number;
  categoryLabel: string;
  categoryValue: number | undefined;
  sharePercent: number;
  sectorGrowthPercent: number | undefined;
  totalGrowthPercent: number;
}

const formatNumber = (value: number | undefined) => {
  if (value === undefined || !Number.isFinite(value)) return "—";

  return new Intl.NumberFormat("id-ID", { maximumFractionDigits: 2 }).format(value);
};

const GrowthValue = ({ value }: { value: number | undefined }) => {
  if (value === undefined || !Number.isFinite(value)) {
    return <span className="text-muted-foreground">Data tidak tersedia</span>;
  }

  const Icon = value > 0 ? ArrowUpRight : value < 0 ? ArrowDownRight : Minus;
  const color = value > 0 ? "text-emerald-700 dark:text-emerald-300" : value < 0 ? "text-rose-700 dark:text-rose-300" : "text-muted-foreground";

  return (
    <span className={`inline-flex items-center gap-1 text-xl font-semibold leading-none tabular-nums xl:text-lg ${color}`}>
      <Icon aria-hidden="true" className="size-6 xl:size-5" />
      {formatNumber(value)}%
    </span>
  );
};

const ShareGauge = ({ value }: { value: number }) => {
  const clampedValue = Number.isFinite(value) ? Math.max(0, Math.min(100, value)) : 0;
  const gaugeColor = clampedValue > 40 ? "#16a34a" : clampedValue >= 20 ? "#eab308" : "#dc2626";
  const arcPath = "M 16 56 A 44 44 0 0 1 104 56";

  return (
    <svg
      aria-hidden="true"
      className="h-full w-full"
      viewBox="0 0 120 68"
      preserveAspectRatio="xMidYMid meet"
    >
      <path
        d={arcPath}
        pathLength="100"
        fill="none"
        strokeWidth="20"
        strokeLinecap="round"
        className="stroke-violet-200 dark:stroke-white"
      />
      <path
        d={arcPath}
        pathLength="100"
        fill="none"
        stroke={gaugeColor}
        strokeWidth="20"
        strokeLinecap="round"
        strokeDasharray={`${clampedValue} 100`}
        className="transition-[stroke-dasharray,stroke] duration-700 ease-out motion-reduce:transition-none"
      />
    </svg>
  );
};

const PdrbStatCards = ({
  referenceYear,
  categoryLabel,
  categoryValue,
  sharePercent,
  sectorGrowthPercent,
  totalGrowthPercent,
}: PdrbStatCardsProps) => (
  <section aria-label="Ringkasan indikator PDRB" className="grid min-w-0 auto-rows-min grid-cols-1 items-start gap-3 sm:grid-cols-2 xl:h-[14.25rem] xl:grid-rows-2 xl:gap-2">
    <Card className="h-[8.5rem] min-w-0 justify-between gap-1.5 overflow-hidden border-violet-200 bg-violet-50 py-2.5 transition-all hover:-translate-y-0.5 hover:border-violet-300 hover:shadow-md xl:h-full xl:gap-1.5 xl:py-1.5 dark:border-violet-900/60 dark:bg-violet-950/40 dark:hover:border-violet-700">
      <CardHeader className="gap-y-1.5 px-3 pb-0 xl:px-2.5">
        <CardDescription className="text-violet-700 dark:text-violet-300 xl:text-[0.7rem] xl:leading-tight">Nilai kategori · {referenceYear}</CardDescription>
        <CardTitle className="break-words text-base leading-snug text-violet-950 dark:text-violet-100 xl:line-clamp-2 xl:text-xs xl:leading-snug">{categoryLabel}</CardTitle>
      </CardHeader>
      <CardContent className="grid flex-1 content-center gap-1.5 px-3 xl:px-2.5">
        <p className="-translate-y-0.5 break-words text-2xl font-semibold leading-tight tabular-nums text-violet-800 dark:text-violet-200 xl:text-lg">
          {formatNumber(categoryValue)}
        </p>
        <p className="text-xs leading-tight text-violet-700/80 dark:text-violet-300/80">Miliar rupiah</p>
      </CardContent>
    </Card>

    <Card className="h-[8.5rem] min-w-0 justify-between gap-0 overflow-hidden border-violet-200 bg-violet-50 py-2.5 transition-all hover:-translate-y-0.5 hover:border-violet-300 hover:shadow-md xl:h-full xl:py-1 dark:border-violet-900/60 dark:bg-violet-950/40 dark:hover:border-violet-700">
      <CardHeader className="gap-y-1.5 px-3 pb-0 xl:px-2.5">
        <CardDescription className="text-violet-700 dark:text-violet-300 xl:text-[0.7rem] xl:leading-tight">Pangsa terhadap PDRB · {referenceYear}</CardDescription>
        <CardTitle className="break-words text-base leading-snug text-violet-950 dark:text-violet-100 xl:line-clamp-2 xl:text-xs xl:leading-tight">{categoryLabel}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 items-center px-3 pt-0 xl:px-2.5">
        <div
          role="img"
          aria-label={`Pangsa ${categoryLabel} terhadap PDRB ${formatNumber(sharePercent)} persen`}
          className="grid h-14 w-full grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] items-center gap-2 xl:h-[4.25rem]"
        >
          <div aria-hidden="true" className="h-full min-h-0 min-w-0">
            <ShareGauge value={sharePercent} />
          </div>
          <p className="-translate-y-0.5 text-center text-2xl font-semibold leading-none tabular-nums text-violet-800 dark:text-violet-200 xl:text-2xl">
            {formatNumber(sharePercent)}%
          </p>
        </div>
      </CardContent>
    </Card>

    <Card className="h-[8.5rem] min-w-0 justify-between gap-1.5 overflow-hidden border-violet-200 bg-violet-50 py-2.5 transition-all hover:-translate-y-0.5 hover:border-violet-300 hover:shadow-md xl:h-full xl:gap-1.5 xl:py-1.5 dark:border-violet-900/60 dark:bg-violet-950/40 dark:hover:border-violet-700">
      <CardHeader className="gap-y-1.5 px-3 pb-0 xl:px-2.5">
        <CardDescription className="xl:text-[0.7rem] xl:leading-tight">Pertumbuhan kategori · {referenceYear}</CardDescription>
        <CardTitle className="break-words text-base leading-snug text-violet-950 dark:text-violet-100 xl:line-clamp-2 xl:text-xs xl:leading-snug">{categoryLabel}</CardTitle>
      </CardHeader>
      <CardContent className="grid flex-1 content-center gap-2 px-3 xl:gap-1.5 xl:px-2.5">
        <GrowthValue value={sectorGrowthPercent} />
        <p className="text-xs leading-snug text-muted-foreground">Perubahan dari tahun sebelumnya</p>
      </CardContent>
    </Card>

    <Card className="h-[8.5rem] min-w-0 justify-between gap-1.5 overflow-hidden border-violet-200 bg-violet-50 py-2.5 transition-all hover:-translate-y-0.5 hover:border-violet-300 hover:shadow-md xl:h-full xl:gap-1.5 xl:py-1.5 dark:border-violet-900/60 dark:bg-violet-950/40 dark:hover:border-violet-700">
      <CardHeader className="gap-y-1.5 px-3 pb-0 xl:px-2.5">
        <CardDescription className="xl:text-[0.7rem] xl:leading-tight">Pertumbuhan PDRB · {referenceYear}</CardDescription>
        <CardTitle className="text-base leading-snug text-violet-950 dark:text-violet-100 xl:line-clamp-2 xl:text-xs xl:leading-snug">Total Kabupaten Merangin</CardTitle>
      </CardHeader>
      <CardContent className="grid flex-1 content-center gap-2 px-3 xl:gap-1.5 xl:px-2.5">
        <GrowthValue value={totalGrowthPercent} />
        <p className="text-xs leading-snug text-muted-foreground">Perubahan dari tahun sebelumnya</p>
      </CardContent>
    </Card>
  </section>
);

export default PdrbStatCards;
