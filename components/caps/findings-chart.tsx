"use client"

import { AlertTriangle } from "lucide-react"

interface Finding {
  cap_id: string
  severity: string
  status: string
}

interface FindingsChartProps {
  findings: Finding[]
}

const categories = [
  { name: "Timeliness", count: 8, color: "oklch(0.60 0.15 240)" },
  { name: "Documentation", count: 6, color: "oklch(0.60 0.15 240)" },
  { name: "Provider FTE", count: 5, color: "oklch(0.60 0.15 240)" },
  { name: "Contract dates", count: 3, color: "oklch(0.60 0.15 240)" },
  { name: "Quality program", count: 2, color: "oklch(0.60 0.15 240)" },
]

export function FindingsChart({ findings }: FindingsChartProps) {
  const maxCount = Math.max(...categories.map(c => c.count))

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-sm font-medium">Findings by category</h3>
      </div>
      
      <div className="space-y-3">
        {categories.map((category) => (
          <div key={category.name} className="flex items-center gap-3">
            <span className="text-sm text-foreground w-28 shrink-0">{category.name}</span>
            <div className="flex-1 h-4 bg-muted rounded-sm overflow-hidden">
              <div 
                className="h-full rounded-sm transition-all"
                style={{ 
                  width: `${(category.count / maxCount) * 100}%`,
                  backgroundColor: category.color 
                }}
              />
            </div>
            <span className="text-sm text-muted-foreground w-6 text-right">{category.count}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
