"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { formatDate, getDaysRemaining, getStatusColor, getPriorityColor } from "@/lib/utils"
import type { CAP } from "@/lib/types"
import { ArrowLeft, Calendar, Clock, Building, Edit, CheckCircle, AlertCircle } from "lucide-react"

interface CAPHeaderProps {
  cap: CAP
}

export function CAPHeader({ cap }: CAPHeaderProps) {
  const daysRemaining = getDaysRemaining(cap.due_date)
  const isOverdue = cap.status !== "Closed" && daysRemaining < 0
  const thirtyDayDaysRemaining = getDaysRemaining(cap.thirty_day_deadline)

  return (
    <div className="space-y-6 mb-8">
      {/* Breadcrumb & Actions */}
      <div className="flex items-center justify-between">
        <Link
          href="/caps"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to CAPs
        </Link>
        <div className="flex items-center gap-2">
          <Link href={`/caps/${cap.id}/edit`}>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </Link>
          <Button size="sm">
            <CheckCircle className="h-4 w-4 mr-2" />
            Submit Response
          </Button>
        </div>
      </div>

      {/* Title Section */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <span className="font-mono text-lg font-semibold text-primary">
            {cap.cap_number}
          </span>
          <Badge className={getStatusColor(cap.status)} variant="secondary">
            {cap.status}
          </Badge>
          <Badge className={getPriorityColor(cap.priority)} variant="secondary">
            {cap.priority}
          </Badge>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">{cap.title}</h1>
        {cap.description && (
          <p className="text-muted-foreground mt-2 max-w-3xl">{cap.description}</p>
        )}
      </div>

      {/* Key Info Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-primary/10 p-2">
                <Building className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Program Area</p>
                <p className="font-medium">{cap.program_area}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-info/10 p-2">
                <Calendar className="h-4 w-4 text-info" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Issued Date</p>
                <p className="font-medium">{formatDate(cap.issued_date)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`rounded-full p-2 ${isOverdue ? "bg-destructive/10" : "bg-warning/10"}`}>
                <Clock className={`h-4 w-4 ${isOverdue ? "text-destructive" : "text-warning-foreground"}`} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Due Date</p>
                <p className={`font-medium ${isOverdue ? "text-destructive" : ""}`}>
                  {formatDate(cap.due_date)}
                  {cap.status !== "Closed" && (
                    <span className="text-xs ml-1">
                      ({isOverdue ? `${Math.abs(daysRemaining)}d overdue` : `${daysRemaining}d`})
                    </span>
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`rounded-full p-2 ${cap.thirty_day_met ? "bg-success/10" : "bg-warning/10"}`}>
                {cap.thirty_day_met ? (
                  <CheckCircle className="h-4 w-4 text-success" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-warning-foreground" />
                )}
              </div>
              <div>
                <p className="text-xs text-muted-foreground">30-Day Response</p>
                <p className="font-medium">
                  {cap.thirty_day_met ? (
                    <span className="text-success">Submitted {formatDate(cap.thirty_day_response_date)}</span>
                  ) : (
                    <span className="text-warning-foreground">
                      Due {formatDate(cap.thirty_day_deadline)}
                      {thirtyDayDaysRemaining > 0 && ` (${thirtyDayDaysRemaining}d)`}
                    </span>
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary */}
      {cap.summary && (
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm font-medium mb-2">Summary</h3>
            <p className="text-sm text-muted-foreground">{cap.summary}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
