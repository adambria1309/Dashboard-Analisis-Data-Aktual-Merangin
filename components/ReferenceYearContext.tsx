"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_REFERENCE_YEAR,
  getReferenceYears,
  useDashboardData,
} from "@/components/DashboardDataContext";

interface ReferenceYearContextValue {
  referenceYear: number;
  setReferenceYear: (year: number) => void;
}

const ReferenceYearContext = createContext<ReferenceYearContextValue | null>(null);

export function ReferenceYearProvider({ children }: { children: ReactNode }) {
  const { pdrbLu, pdrbExp, socioeko } = useDashboardData();
  const referenceYears = getReferenceYears({ pdrbLu, pdrbExp, socioeko });
  const latestReferenceYear = referenceYears.at(-1) ?? DEFAULT_REFERENCE_YEAR;
  const [selection, setSelection] = useState<{
    year: number;
    latestYear: number;
  } | null>(null);
  const referenceYear =
    selection?.latestYear === latestReferenceYear && referenceYears.includes(selection.year)
      ? selection.year
      : latestReferenceYear;
  const setReferenceYear = (year: number) => {
    setSelection({ year, latestYear: latestReferenceYear });
  };

  return (
    <ReferenceYearContext.Provider value={{ referenceYear, setReferenceYear }}>
      {children}
    </ReferenceYearContext.Provider>
  );
}

export function useReferenceYear() {
  const context = useContext(ReferenceYearContext);

  if (!context) {
    throw new Error("useReferenceYear must be used within ReferenceYearProvider");
  }

  return context;
}

export function ReferenceYearSelect() {
  const { referenceYear, setReferenceYear } = useReferenceYear();
  const { pdrbLu, pdrbExp, socioeko } = useDashboardData();
  const referenceYears = getReferenceYears({ pdrbLu, pdrbExp, socioeko });

  return (
    <section className="mb-5 flex min-w-0 flex-col gap-3 rounded-xl border border-slate-200 bg-card/90 px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:border-slate-700">
      <div className="min-w-0">
        <label htmlFor="reference-year" className="block text-sm font-semibold text-foreground">
          Tahun referensi
        </label>
        <p id="reference-year-help" className="mt-0.5 text-xs text-muted-foreground">
          Grafik dan ringkasan menampilkan data sampai tahun yang dipilih.
        </p>
      </div>
      <select
        id="reference-year"
        aria-describedby="reference-year-help"
        className="min-h-10 w-full rounded-md border border-violet-200 bg-white px-3 text-sm font-semibold text-violet-900 shadow-sm outline-none transition-colors hover:border-violet-400 focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 sm:w-36 dark:border-violet-900 dark:bg-slate-950 dark:text-violet-100"
        value={referenceYear}
        onChange={(event) => setReferenceYear(Number(event.target.value))}
      >
        {[...referenceYears].reverse().map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </section>
  );
}
