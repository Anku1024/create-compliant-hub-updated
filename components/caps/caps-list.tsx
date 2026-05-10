"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDate, getDaysRemaining, getStatusColor, getPriorityColor } from "@/lib/utils"
import type { CAP } from "@/lib/types"
import { ChevronRight, Calendar, User, Building } from "lucide-react"

interface CAPsListProps {
  caps: CAP[]
}

export function CAPsList({ caps }: CAPsListProps) {
  if (caps.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground">No CAPs found</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {caps.map((cap) => {
        const daysRemaining = getDaysRemaining(cap.due_date)
        const isOverdue = cap.status !== "Closed" && daysRemaining < 0
        const thirtyDayDaysRemaining = getDaysRemaining(cap.thirty_day_deadline)
        const thirtyDayUrgent = !cap.thirty_day_met && thirtyDayDaysRemaining <= 7 && thirtyDayDaysRemaining > 0

        return (
          <Link key={cap.id} href={`/caps/${cap.id}`}>
            <Card className="transition-all hover:shadow-md hover:border-primary/30">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    {/* Header */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-sm font-medium text-primary">
                        {cap.cap_number}
                      </span>
                      <Badge className={getStatusColor(cap.status)} variant="secondary">
                        {cap.status}
                      </Badge>
                      <Badge className={getPriorityColor(cap.priority)} variant="secondary">
                        {cap.priority}
                      </Badge>
                      {thirtyDayUrgent && (
                        <Badge variant="secondary" className="bg-warning/10 text-warning-foreground">
                          30-Day in {thirtyDayDaysRemaining}d
                        </Badge>
                      )}
                      {isOverdue && (
                        <Badge variant="secondary" className="bg-destructive/10 text-destructive">
                          Overdue
                        </Badge>
                      )}
                    </div>

                    {/* Title and Summary */}
                    <div>
                      <h3 className="font-semibold text-lg">{cap.title}</h3>
                      {cap.summary && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {cap.summary}
                        </p>
                      )}
                    </div>

                    {/* Meta Info */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Building className="h-4 w-4" />
                        {cap.program_area}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Due: {formatDate(cap.due_date)}
                      </span>
                      {cap.status !== "Closed" && (
                        <span className={isOverdue ? "text-destructive font-medium" : ""}>
                          {isOverdue
                            ? `${Math.abs(daysRemaining)} days overdue`
                            : `${daysRemaining} days remaining`}
                        </span>
                      )}
                    </div>
                  </div>

                  <ChevronRight className="h-5 w-5 text-muted-foreground mt-2" />
                </div>
              </CardContent>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}
