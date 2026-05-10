"use client"

import { Calendar } from "lucide-react"
import { cn } from "@/lib/utils"

type Period = "current_open" | "this_month" | "last_month" | "this_quarter" | "last_quarter" | "ytd"

const periods: { value: Period; label: string }[] = [
  { value: "current_open", label: "Current open" },
  { value: "this_month", label: "This month" },
  { value: "last_month", label: "Last month" },
  { value: "this_quarter", label: "This quarter" },
  { value: "last_quarter", label: "Last quarter" },
  { value: "ytd", label: "Year to date" },
]

interface PeriodFilterProps {
  period: Period
  onPeriodChange: (period: Period) => void
}

export function PeriodFilter({ period, onPeriodChange }: PeriodFilterProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Calendar className="h-4 w-4" />
        <span className="text-sm">Period:</span>
      </div>
      <div className="flex items-center gap-1">
        {periods.map((p) => (
          <button
            key={p.value}
            onClick={() => onPeriodChange(p.value)}
            className={cn(
              "px-3 py-1.5 text-sm rounded-md transition-colors",
              period === p.value
                ? "bg-card border border-border text-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  )
}
