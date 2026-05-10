import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "—"
  const d = typeof date === "string" ? new Date(date) : date
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export function getDaysRemaining(dueDate: string | Date): number {
  const due = typeof dueDate === "string" ? new Date(dueDate) : dueDate
  const now = new Date()
  const diffTime = due.getTime() - now.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "Open":
      return "bg-destructive/10 text-destructive"
    case "In Progress":
      return "bg-info/10 text-info"
    case "Submitted":
      return "bg-warning/10 text-warning-foreground"
    case "Closed":
      return "bg-success/10 text-success"
    default:
      return "bg-muted text-muted-foreground"
  }
}

export function getPriorityColor(priority: string): string {
  switch (priority) {
    case "High":
      return "bg-destructive/10 text-destructive"
    case "Medium":
      return "bg-warning/10 text-warning-foreground"
    case "Low":
      return "bg-muted text-muted-foreground"
    default:
      return "bg-muted text-muted-foreground"
  }
}

export function getSeverityColor(severity: string): string {
  switch (severity) {
    case "Critical":
      return "bg-destructive/10 text-destructive"
    case "Major":
      return "bg-warning/10 text-warning-foreground"
    case "Minor":
      return "bg-muted text-muted-foreground"
    default:
      return "bg-muted text-muted-foreground"
  }
}
