"use client"

import { BarChart3 } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Legend } from "recharts"

interface Cap {
  id: string
  issued_date: string
  due_date: string
  status: string
}

interface CapsChartProps {
  caps: Cap[]
}

export function CapsChart({ caps }: CapsChartProps) {
  // Generate monthly data for the last 6 months
  const monthNames = ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr"]
  
  const data = monthNames.map((month, index) => {
    // Simulated data based on the screenshot
    const opened = [3, 4, 4, 5, 8, 7][index]
    const overdue = [0, 0, 0, 1, 4, 3][index]
    
    return {
      month,
      opened,
      overdue,
    }
  })

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-sm font-medium">CAPs by month</h3>
      </div>
      
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height={192} minWidth={200}>
          <BarChart data={data} barGap={2}>
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'oklch(0.65 0 0)', fontSize: 12 }}
            />
            <YAxis hide />
            <Bar dataKey="opened" radius={[2, 2, 0, 0]} maxBarSize={32}>
              {data.map((_, index) => (
                <Cell key={`opened-${index}`} fill="oklch(0.60 0.15 240)" />
              ))}
            </Bar>
            <Bar dataKey="overdue" radius={[2, 2, 0, 0]} maxBarSize={32}>
              {data.map((_, index) => (
                <Cell key={`overdue-${index}`} fill="oklch(0.65 0.18 15)" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex items-center gap-4 mt-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: 'oklch(0.60 0.15 240)' }} />
          <span className="text-xs text-muted-foreground">Opened</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: 'oklch(0.65 0.18 15)' }} />
          <span className="text-xs text-muted-foreground">Overdue</span>
        </div>
      </div>
    </div>
  )
}
