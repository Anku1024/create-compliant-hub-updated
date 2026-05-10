"use client"

import { AlertCircle, ArrowDown, ArrowUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface KPICardsRowProps {
  period: string
  totalCaps: number
  openCaps: number
  inProgressCaps: number
  closedCaps: number
  overdueActions: number
  answeredQuestions: number
  totalQuestions: number
  thirtyDayResponses: number
  thirtyDayTotal: number
}

export function KPICardsRow({
  period,
  totalCaps,
  openCaps,
  inProgressCaps,
  closedCaps,
  overdueActions,
  answeredQuestions,
  totalQuestions,
  thirtyDayResponses,
  thirtyDayTotal,
}: KPICardsRowProps) {
  const isCurrentOpen = period === "current_open"
  
  // Different layouts for "current open" vs historical periods
  if (isCurrentOpen) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <KPICard
          label="Total CAPs"
          value={totalCaps.toString()}
          sublabel="FY2026 Q2"
        />
        <KPICard
          label="Open"
          value={openCaps.toString()}
          sublabel="Needs assignment"
          valueColor="text-warning"
          hasAlert={openCaps > 0}
        />
        <KPICard
          label="In progress"
          value={inProgressCaps.toString()}
          sublabel="Actions underway"
        />
        <KPICard
          label="Overdue actions"
          value={overdueActions.toString()}
          sublabel="Past deadline"
          valueColor="text-error"
        />
        <KPICard
          label="Questions answered"
          value={`${answeredQuestions}/${totalQuestions}`}
          sublabel="Across all open CAPs"
        />
        <KPICard
          label="30-day compliance"
          value={`${thirtyDayResponses}/${thirtyDayTotal}`}
          sublabel="Responded on time"
          valueColor={thirtyDayResponses === thirtyDayTotal ? "text-success" : "text-warning"}
        />
      </div>
    )
  }

  // Historical period view with comparison metrics
  const closureRate = totalCaps > 0 ? Math.round((closedCaps / totalCaps) * 100) : 0
  const thirtyDayRate = thirtyDayTotal > 0 ? Math.round((thirtyDayResponses / thirtyDayTotal) * 100) : 0
  const overdueResponses = totalCaps - closedCaps - openCaps - inProgressCaps

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-3">
        <KPICardLarge
          value={totalCaps.toString()}
          label="CAPs in period"
          change={-2}
          changeLabel="vs prior period"
        />
        <KPICardLarge
          value={closedCaps.toString()}
          label="Closed"
          sublabel={`${closureRate}% closure rate`}
          sublabelColor="text-success"
        />
        <KPICardLarge
          value={overdueResponses > 0 ? overdueResponses.toString() : "0"}
          label="Overdue responses"
          valueColor="text-error"
          change={1}
          changeLabel="vs prior period"
          changePositive={false}
        />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <KPICardLarge
          value="16d"
          label="Avg resolution time"
          change={-2}
          changeLabel="days vs prior"
        />
        <KPICardLarge
          value={`${thirtyDayRate}%`}
          label="30-day compliance"
          change={4}
          changeLabel="vs prior period"
          changePositive={true}
        />
        <KPICardLarge
          value="74%"
          label="AI draft acceptance"
          change={8}
          changeLabel="vs prior"
          changePositive={true}
        />
      </div>
    </div>
  )
}

interface KPICardProps {
  label: string
  value: string
  sublabel?: string
  valueColor?: string
  hasAlert?: boolean
}

function KPICard({ label, value, sublabel, valueColor, hasAlert }: KPICardProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-start justify-between">
        <p className="text-xs text-muted-foreground">{label}</p>
        {hasAlert && <AlertCircle className="h-3.5 w-3.5 text-warning" />}
      </div>
      <p className={cn("text-2xl font-semibold mt-1", valueColor)}>{value}</p>
      {sublabel && (
        <p className="text-xs text-muted-foreground mt-0.5">{sublabel}</p>
      )}
    </div>
  )
}

interface KPICardLargeProps {
  value: string
  label: string
  sublabel?: string
  sublabelColor?: string
  valueColor?: string
  change?: number
  changeLabel?: string
  changePositive?: boolean
}

function KPICardLarge({ 
  value, 
  label, 
  sublabel, 
  sublabelColor,
  valueColor, 
  change, 
  changeLabel,
  changePositive 
}: KPICardLargeProps) {
  const showChange = change !== undefined
  const isPositive = changePositive ?? (change !== undefined && change < 0)

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <p className={cn("text-3xl font-semibold", valueColor)}>{value}</p>
      <p className="text-sm text-muted-foreground mt-1">{label}</p>
      {sublabel && (
        <p className={cn("text-xs mt-0.5", sublabelColor || "text-muted-foreground")}>
          {sublabel}
        </p>
      )}
      {showChange && (
        <div className={cn(
          "flex items-center gap-1 text-xs mt-1",
          isPositive ? "text-success" : "text-error"
        )}>
          {isPositive ? (
            <ArrowDown className="h-3 w-3" />
          ) : (
            <ArrowUp className="h-3 w-3" />
          )}
          <span>{Math.abs(change!)} {changeLabel}</span>
        </div>
      )}
    </div>
  )
}
