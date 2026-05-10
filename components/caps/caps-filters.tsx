"use client"

import { Search } from "lucide-react"
import { cn } from "@/lib/utils"

const filters = [
  { value: "all", label: "All" },
  { value: "high_priority", label: "High priority" },
  { value: "overdue", label: "Overdue" },
  { value: "my_items", label: "My items" },
  { value: "submitted", label: "Submitted" },
]

interface CapsFiltersProps {
  filter: string
  onFilterChange: (filter: string) => void
  search: string
  onSearchChange: (search: string) => void
}

export function CapsFilters({ filter, onFilterChange, search, onSearchChange }: CapsFiltersProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => onFilterChange(f.value)}
            className={cn(
              "px-3 py-1.5 text-sm rounded-full border transition-colors",
              filter === f.value
                ? "bg-card border-border text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search CAPs..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-9 w-64 rounded-lg border border-border bg-muted pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
    </div>
  )
}
