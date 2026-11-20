import { ChevronDown } from "lucide-react";

export interface IndicatorOption {
  value: string;
  label: string;
}

interface IndicatorSelectProps {
  id: string;
  label: string;
  value: string;
  options: readonly IndicatorOption[];
  onValueChange: (value: string) => void;
  color?: "blue" | "green" | "lavender";
  compact?: boolean;
}

const colorClasses = {
  blue: "bg-sky-700 focus-visible:ring-sky-500",
  green: "bg-emerald-700 focus-visible:ring-emerald-500",
  lavender: "bg-violet-700 focus-visible:ring-violet-500",
};

const IndicatorSelect = ({
  id,
  label,
  value,
  options,
  onValueChange,
  color = "blue",
  compact = false,
}: IndicatorSelectProps) => (
  <div className="relative min-w-0">
    <label htmlFor={id} className="sr-only">
      {label}
    </label>
    <select
      id={id}
      value={value}
      onChange={(event) => onValueChange(event.target.value)}
      className={`w-full min-w-0 appearance-none rounded-md border border-white/50 ${colorClasses[color]} font-medium text-white shadow-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background ${compact ? "min-h-10 py-2 pl-2 pr-7 text-xs sm:min-h-11 sm:pl-3 sm:pr-10 sm:text-sm" : "min-h-11 py-2 pl-3 pr-10 text-sm"}`}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    <ChevronDown
      aria-hidden="true"
      className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-white ${compact ? "right-2 size-3.5 sm:right-3 sm:size-4" : "right-3 size-4"}`}
    />
  </div>
);

export default IndicatorSelect;
