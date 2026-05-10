"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatDate, getDaysRemaining, getStatusColor, getPriorityColor } from "@/lib/utils"
import type { CAP } from "@/lib/types"
import { ArrowRight, ChevronRight } from "lucide-react"

interface CAPsTableProps {
  caps: CAP[]
}

export function CAPsTable({ caps }: CAPsTableProps) {
  // Sort by priority (High first) then by due date
  const sortedCaps = [...caps]
    .filter((cap) => cap.status !== "Closed")
    .sort((a, b) => {
      const priorityOrder = { High: 0, Medium: 1, Low: 2 }
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority]
      }
      return new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
    })
    .slice(0, 5)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Active CAPs</CardTitle>
        <Link href="/caps">
          <Button variant="ghost" size="sm">
            View All
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedCaps.map((cap) => {
            const daysRemaining = getDaysRemaining(cap.due_date)
            const isOverdue = daysRemaining < 0

            return (
              <Link
                key={cap.id}
                href={`/caps/${cap.id}`}
                className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
              >
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm text-muted-foreground">
                      {cap.cap_number}
                    </span>
                    <Badge className={getStatusColor(cap.status)} variant="secondary">
                      {cap.status}
                    </Badge>
                    <Badge className={getPriorityColor(cap.priority)} variant="secondary">
                      {cap.priority}
                    </Badge>
                  </div>
                  <p className="font-medium">{cap.title}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{cap.program_area}</span>
                    <span>Due: {formatDate(cap.due_date)}</span>
                    {isOverdue ? (
                      <span className="text-destructive font-medium">
                        {Math.abs(daysRemaining)} days overdue
                      </span>
                    ) : (
                      <span>
                        {daysRemaining} days remaining
                      </span>
                    )}
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </Link>
            )
          })}

          {sortedCaps.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No active CAPs
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
