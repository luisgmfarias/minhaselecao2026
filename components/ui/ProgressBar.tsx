import { cn } from "@/lib/utils/cn";

interface ProgressBarProps {
  value: number;
  max: number;
  className?: string;
  colorClass?: string;
  showLabel?: boolean;
}

export function ProgressBar({
  value,
  max,
  className,
  colorClass = "bg-green-500",
  showLabel = false,
}: ProgressBarProps) {
  const pct = Math.min(100, (value / max) * 100);
  const full = value >= max;

  return (
    <div className={cn("relative h-2 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700", className)}>
      <div
        className={cn(
          "h-full rounded-full transition-all duration-500 ease-out",
          full ? "bg-yellow-400" : colorClass
        )}
        style={{ width: `${pct}%` }}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      />
      {showLabel && (
        <span className="sr-only">
          {value} de {max}
        </span>
      )}
    </div>
  );
}
