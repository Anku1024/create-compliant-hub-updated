"use client"

import { useState, useMemo } from "react"
import { Plus, Table2, Calendar, Mail, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PeriodFilter } from "@/components/caps/period-filter"
import { KPICardsRow } from "@/components/caps/kpi-cards-row"
import { CapsChart } from "@/components/caps/caps-chart"
import { FindingsChart } from "@/components/caps/findings-chart"
import { CapsFilters } from "@/components/caps/caps-filters"
import { CapsDataTable } from "@/components/caps/caps-data-table"
import { cn } from "@/lib/utils"
import Link from "next/link"

type Period = "current_open" | "this_month" | "last_month" | "this_quarter" | "last_quarter" | "ytd"

interface Cap {
  id: string
  cap_number: string
  title: string
  description: string
  program_area: string
  priority: string
  status: string
  assigned_to: string | null
  issued_date: string
  due_date: string
  thirty_day_deadline: string
  thirty_day_met: boolean
  thirty_day_response_date: string | null
}

interface Question {
  cap_id: string
  answered: boolean
}

interface Action {
  cap_id: string
  status: string
  due_date: string
}

interface Finding {
  cap_id: string
  severity: string
  status: string
}

interface EmailThread {
  id: string
  cap_id: string | null
  subject: string
  from_address: string
  received_at: string
  preview: string
}

interface CapsPageContentProps {
  caps: Cap[]
  questions: Question[]
  actions: Action[]
  findings: Finding[]
  recentEmail: EmailThread | null
}

export function CapsPageContent({ 
  caps, 
  questions, 
  actions, 
  findings,
  recentEmail 
}: CapsPageContentProps) {
  const [period, setPeriod] = useState<Period>("current_open")
  const [filter, setFilter] = useState("all")
  const [search, setSearch] = useState("")

  // Filter caps based on period
  const filteredCaps = useMemo(() => {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)
    const startOfQuarter = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1)
    const startOfLastQuarter = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3 - 3, 1)
    const endOfLastQuarter = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 0)
    const startOfYear = new Date(now.getFullYear(), 0, 1)

    let periodFiltered = caps

    switch (period) {
      case "current_open":
        periodFiltered = caps.filter(cap => cap.status !== "Closed")
        break
      case "this_month":
        periodFiltered = caps.filter(cap => new Date(cap.issued_date) >= startOfMonth)
        break
      case "last_month":
        periodFiltered = caps.filter(cap => {
          const date = new Date(cap.issued_date)
          return date >= startOfLastMonth && date <= endOfLastMonth
        })
        break
      case "this_quarter":
        periodFiltered = caps.filter(cap => new Date(cap.issued_date) >= startOfQuarter)
        break
      case "last_quarter":
        periodFiltered = caps.filter(cap => {
          const date = new Date(cap.issued_date)
          return date >= startOfLastQuarter && date <= endOfLastQuarter
        })
        break
      case "ytd":
        periodFiltered = caps.filter(cap => new Date(cap.issued_date) >= startOfYear)
        break
    }

    // Apply filter
    switch (filter) {
      case "high_priority":
        periodFiltered = periodFiltered.filter(cap => cap.priority === "High")
        break
      case "overdue":
        periodFiltered = periodFiltered.filter(cap => 
          new Date(cap.due_date) < new Date() && cap.status !== "Closed"
        )
        break
      case "submitted":
        periodFiltered = periodFiltered.filter(cap => cap.status === "Submitted")
        break
    }

    // Apply search
    if (search) {
      const searchLower = search.toLowerCase()
      periodFiltered = periodFiltered.filter(cap => 
        cap.cap_number.toLowerCase().includes(searchLower) ||
        cap.title.toLowerCase().includes(searchLower) ||
        cap.description?.toLowerCase().includes(searchLower)
      )
    }

    return periodFiltered
  }, [caps, period, filter, search])

  // Calculate KPIs
  const kpis = useMemo(() => {
    const now = new Date()
    const totalCaps = filteredCaps.length
    const openCaps = filteredCaps.filter(cap => cap.status === "Open").length
    const inProgressCaps = filteredCaps.filter(cap => cap.status === "In Progress").length
    const closedCaps = filteredCaps.filter(cap => cap.status === "Closed").length
    
    const overdueActions = actions.filter(action => {
      const cap = filteredCaps.find(c => c.id === action.cap_id)
      if (!cap) return false
      return action.status !== "Completed" && new Date(action.due_date) < now
    }).length

    const totalQuestions = questions.filter(q => 
      filteredCaps.some(cap => cap.id === q.cap_id)
    )
    const answeredQuestions = totalQuestions.filter(q => q.answered).length

    const thirtyDayResponses = filteredCaps.filter(cap => cap.thirty_day_met).length
    const thirtyDayTotal = filteredCaps.filter(cap => 
      cap.thirty_day_deadline && new Date(cap.thirty_day_deadline) <= now
    ).length

    return {
      totalCaps,
      openCaps,
      inProgressCaps,
      closedCaps,
      overdueActions,
      answeredQuestions,
      totalQuestions: totalQuestions.length,
      thirtyDayResponses,
      thirtyDayTotal,
    }
  }, [filteredCaps, actions, questions])

  // Prepare data for table
  const tableData = useMemo(() => {
    return filteredCaps.map(cap => {
      const capQuestions = questions.filter(q => q.cap_id === cap.id)
      const capFindings = findings.filter(f => f.cap_id === cap.id)
      
      return {
        ...cap,
        questionsAnswered: capQuestions.filter(q => q.answered).length,
        totalQuestions: capQuestions.length,
        findingsCount: capFindings.length,
      }
    })
  }, [filteredCaps, questions, findings])

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Corrective action plans</h1>
          <p className="text-sm text-muted-foreground">Track and manage CAPs from DHCS</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New CAP
        </Button>
      </div>

      {/* Period Filter */}
      <div className="flex items-center justify-between mb-6">
        <PeriodFilter period={period} onPeriodChange={setPeriod} />
        <Button variant="outline" size="sm" className="gap-2">
          <Table2 className="h-4 w-4" />
          Table
        </Button>
      </div>

      {/* KPI Cards */}
      <KPICardsRow 
        period={period}
        totalCaps={kpis.totalCaps}
        openCaps={kpis.openCaps}
        inProgressCaps={kpis.inProgressCaps}
        closedCaps={kpis.closedCaps}
        overdueActions={kpis.overdueActions}
        answeredQuestions={kpis.answeredQuestions}
        totalQuestions={kpis.totalQuestions}
        thirtyDayResponses={kpis.thirtyDayResponses}
        thirtyDayTotal={kpis.thirtyDayTotal}
      />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4 mb-6">
        <CapsChart caps={caps} />
        <FindingsChart findings={findings} />
      </div>

      {/* Email Alert Banner */}
      {recentEmail && (
        <div className="flex items-center gap-3 bg-primary/10 border border-primary/20 rounded-lg px-4 py-3 mb-6">
          <Mail className="h-5 w-5 text-primary" />
          <span className="text-primary font-medium">New DHCS email</span>
          <span className="text-muted-foreground">—</span>
          <span className="text-foreground flex-1 truncate">{recentEmail.subject}</span>
          <Link href={`/caps/${recentEmail.cap_id}`} className="text-primary hover:underline flex items-center gap-1">
            View <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}

      {/* Filters and Search */}
      <CapsFilters 
        filter={filter} 
        onFilterChange={setFilter} 
        search={search}
        onSearchChange={setSearch}
      />

      {/* Data Table */}
      <CapsDataTable data={tableData} />
    </div>
  )
}
