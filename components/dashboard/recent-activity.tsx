import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"
import type { CAP, EmailThread } from "@/lib/types"
import { Mail, AlertCircle, Clock } from "lucide-react"

interface RecentActivityProps {
  caps: CAP[]
  emails: EmailThread[]
}

export function RecentActivity({ caps, emails }: RecentActivityProps) {
  // Get upcoming 30-day deadlines
  const upcoming30Day = caps
    .filter((cap) => {
      const deadline = new Date(cap.thirty_day_deadline)
      const now = new Date()
      const daysUntil = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      return !cap.thirty_day_met && daysUntil > 0 && daysUntil <= 14
    })
    .slice(0, 3)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attention Required</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 30-Day Deadlines */}
        {upcoming30Day.length > 0 && (
          <div>
            <h4 className="text-sm font-medium flex items-center gap-2 mb-3">
              <Clock className="h-4 w-4 text-warning-foreground" />
              Upcoming 30-Day Responses
            </h4>
            <div className="space-y-2">
              {upcoming30Day.map((cap) => {
                const deadline = new Date(cap.thirty_day_deadline)
                const daysUntil = Math.ceil(
                  (deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                )
                return (
                  <div
                    key={cap.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div>
                      <p className="text-sm font-medium">{cap.cap_number}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-[180px]">
                        {cap.title}
                      </p>
                    </div>
                    <Badge variant="secondary" className="bg-warning/10 text-warning-foreground">
                      {daysUntil}d
                    </Badge>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* New Emails */}
        {emails.length > 0 && (
          <div>
            <h4 className="text-sm font-medium flex items-center gap-2 mb-3">
              <Mail className="h-4 w-4 text-success" />
              New DHCS Communications
            </h4>
            <div className="space-y-2">
              {emails.slice(0, 3).map((email) => (
                <div
                  key={email.id}
                  className="flex items-start gap-3 rounded-lg border p-3"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{email.subject}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(email.received_at)}
                    </p>
                  </div>
                  {email.classification === "cap_notice" && (
                    <Badge variant="secondary" className="bg-destructive/10 text-destructive shrink-0">
                      CAP
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Past Due Alert */}
        {caps.some((cap) => {
          const dueDate = new Date(cap.due_date)
          return cap.status !== "Closed" && dueDate < new Date()
        }) && (
          <div className="rounded-lg bg-destructive/10 p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <p className="text-sm font-medium text-destructive">
                {caps.filter((cap) => {
                  const dueDate = new Date(cap.due_date)
                  return cap.status !== "Closed" && dueDate < new Date()
                }).length}{" "}
                CAP(s) past due
              </p>
            </div>
            <p className="text-xs text-destructive/80 mt-1">
              Immediate attention required
            </p>
          </div>
        )}

        {upcoming30Day.length === 0 && emails.length === 0 && (
          <p className="text-center text-muted-foreground py-4 text-sm">
            No urgent items
          </p>
        )}
      </CardContent>
    </Card>
  )
}
