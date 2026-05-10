"use client"

import Link from "next/link"
import { format, differenceInDays } from "date-fns"
import { AlertCircle, ArrowDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface CapTableData {
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
  questionsAnswered: number
  totalQuestions: number
  findingsCount: number
}

interface CapsDataTableProps {
  data: CapTableData[]
}

export function CapsDataTable({ data }: CapsDataTableProps) {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">CAP ID</th>
            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Title & description</th>
            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Priority</th>
            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Status</th>
            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Program</th>
            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Assigned to</th>
            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Due date</th>
            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Findings answered</th>
          </tr>
        </thead>
        <tbody>
          {data.map((cap, index) => (
            <CapRow key={cap.id} cap={cap} isLast={index === data.length - 1} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

function CapRow({ cap, isLast }: { cap: CapTableData; isLast: boolean }) {
  // Use UTC dates to avoid hydration mismatch
  const dueDate = new Date(cap.due_date + "T00:00:00Z")
  const issuedDate = new Date(cap.issued_date + "T00:00:00Z")
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const daysUntilDue = differenceInDays(dueDate, today)
  const isOverdue = daysUntilDue < 0 && cap.status !== "Closed"
  const isDueSoon = daysUntilDue >= 0 && daysUntilDue <= 7 && cap.status !== "Closed"

  const progressPercent = cap.totalQuestions > 0 
    ? (cap.questionsAnswered / cap.totalQuestions) * 100 
    : 0

  // Generate initials from assigned_to or show "Unassigned"
  const assigneeName = cap.assigned_to ? "R. Patel" : null // Placeholder
  
  // Format dates consistently using UTC
  const issuedFormatted = format(issuedDate, "MMM d")
  const dueFormatted = format(dueDate, "MMM d")
  
  return (
    <tr className={cn("group hover:bg-muted/50", !isLast && "border-b border-border")}>
      <td className="px-4 py-4">
        <Link href={`/caps/${cap.id}`} className="block">
          <span className="text-primary font-medium text-sm hover:underline">
            {cap.cap_number}
          </span>
          <div className="text-xs text-muted-foreground mt-0.5">
            DHCS · {issuedFormatted}
          </div>
        </Link>
      </td>
      
      <td className="px-4 py-4 max-w-xs">
        <Link href={`/caps/${cap.id}`} className="block">
          <span className="font-medium text-sm text-foreground line-clamp-2">{cap.title}</span>
          <span className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{cap.description}</span>
        </Link>
      </td>
      
      <td className="px-4 py-4">
        <PriorityBadge priority={cap.priority} />
      </td>
      
      <td className="px-4 py-4">
        <StatusBadge status={cap.status} />
      </td>
      
      <td className="px-4 py-4">
        <ProgramBadge program={cap.program_area} />
      </td>
      
      <td className="px-4 py-4">
        {assigneeName ? (
          <span className="text-sm text-foreground">{assigneeName}</span>
        ) : (
          <div className="flex items-center gap-1.5 text-warning">
            <AlertCircle className="h-3.5 w-3.5" />
            <span className="text-sm">Unassigned</span>
          </div>
        )}
      </td>
      
      <td className="px-4 py-4">
        <div className={cn(
          "text-sm",
          isOverdue && "text-error",
          isDueSoon && "text-warning",
          !isOverdue && !isDueSoon && "text-foreground"
        )}>
          {dueFormatted}
          {isOverdue && (
            <div className="flex items-center gap-1 text-xs mt-0.5">
              <ArrowDown className="h-3 w-3" />
              {Math.abs(daysUntilDue)} days overdue
            </div>
          )}
          {isDueSoon && (
            <div className="text-xs mt-0.5">
              {daysUntilDue === 0 ? "Due today" : `${daysUntilDue} days left`}
            </div>
          )}
        </div>
      </td>
      
      <td className="px-4 py-4">
        <div className="flex items-center gap-2">
          <ProgressRing percent={progressPercent} />
          <span className={cn(
            "text-sm font-medium",
            progressPercent === 100 ? "text-success" : progressPercent === 0 ? "text-error" : "text-warning"
          )}>
            {cap.questionsAnswered}/{cap.totalQuestions}
          </span>
          <span className="text-xs text-muted-foreground">answered</span>
        </div>
      </td>
    </tr>
  )
}

function PriorityBadge({ priority }: { priority: string }) {
  return (
    <span className={cn(
      "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border",
      priority === "High" && "border-error/50 text-error bg-error/10",
      priority === "Medium" && "border-warning/50 text-warning bg-warning/10",
      priority === "Low" && "border-muted-foreground/50 text-muted-foreground bg-muted"
    )}>
      {priority}
    </span>
  )
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={cn(
      "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border",
      status === "Open" && "border-warning/50 text-warning bg-warning/10",
      status === "In Progress" && "border-info/50 text-info bg-info/10",
      status === "Submitted" && "border-success/50 text-success bg-success/10",
      status === "Closed" && "border-muted-foreground/50 text-muted-foreground bg-muted"
    )}>
      {status}
    </span>
  )
}

function ProgramBadge({ program }: { program: string }) {
  const shortName = {
    "Mental Health": "Mental health",
    "SUD": "Access",
    "Access & Timeliness": "Access",
    "Quality Improvement": "Quality",
  }[program] || program

  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border border-primary/50 text-primary bg-primary/10">
      {shortName}
    </span>
  )
}

function ProgressRing({ percent }: { percent: number }) {
  const radius = 12
  const stroke = 3
  const normalizedRadius = radius - stroke / 2
  const circumference = normalizedRadius * 2 * Math.PI
  const strokeDashoffset = circumference - (percent / 100) * circumference

  const color = percent === 100 
    ? "oklch(0.65 0.18 145)" 
    : percent === 0 
      ? "oklch(0.60 0.20 25)" 
      : "oklch(0.75 0.16 85)"

  return (
    <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
      <circle
        stroke="oklch(0.28 0.01 260)"
        fill="transparent"
        strokeWidth={stroke}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <circle
        stroke={color}
        fill="transparent"
        strokeWidth={stroke}
        strokeDasharray={circumference + ' ' + circumference}
        style={{ strokeDashoffset }}
        strokeLinecap="round"
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
    </svg>
  )
}
