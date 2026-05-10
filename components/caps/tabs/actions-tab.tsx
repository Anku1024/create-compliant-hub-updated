"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatDate, getDaysRemaining } from "@/lib/utils"
import type { Action } from "@/lib/types"
import { ListTodo, CheckCircle, Clock, Play, User, Calendar, Plus } from "lucide-react"

interface ActionsTabProps {
  actions: Action[]
}

function getActionStatusColor(status: string) {
  switch (status) {
    case "Completed":
      return "bg-success/10 text-success"
    case "In Progress":
      return "bg-info/10 text-info"
    case "Pending":
      return "bg-muted text-muted-foreground"
    default:
      return "bg-muted text-muted-foreground"
  }
}

function getActionStatusIcon(status: string) {
  switch (status) {
    case "Completed":
      return CheckCircle
    case "In Progress":
      return Play
    case "Pending":
      return Clock
    default:
      return Clock
  }
}

export function ActionsTab({ actions }: ActionsTabProps) {
  if (actions.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <ListTodo className="h-12 w-12 text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground mb-4">No corrective actions defined</p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Action
          </Button>
        </CardContent>
      </Card>
    )
  }

  // Group by status
  const pending = actions.filter((a) => a.status === "Pending")
  const inProgress = actions.filter((a) => a.status === "In Progress")
  const completed = actions.filter((a) => a.status === "Completed")

  const renderActionCard = (action: Action) => {
    const daysRemaining = getDaysRemaining(action.due_date)
    const isOverdue = action.status !== "Completed" && daysRemaining < 0
    const StatusIcon = getActionStatusIcon(action.status)

    return (
      <Card key={action.id} className={isOverdue ? "border-destructive/30" : ""}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className={getActionStatusColor(action.status)}>
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {action.status}
                </Badge>
                {isOverdue && (
                  <Badge variant="secondary" className="bg-destructive/10 text-destructive">
                    Overdue
                  </Badge>
                )}
              </div>
              <h4 className="font-medium">{action.title}</h4>
              {action.description && (
                <p className="text-sm text-muted-foreground mt-1">{action.description}</p>
              )}
              <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {action.owner}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Due: {formatDate(action.due_date)}
                </span>
                {action.status !== "Completed" && (
                  <span className={isOverdue ? "text-destructive font-medium" : ""}>
                    {isOverdue ? `${Math.abs(daysRemaining)}d overdue` : `${daysRemaining}d remaining`}
                  </span>
                )}
              </div>
            </div>
            {action.status !== "Completed" && (
              <Button size="sm" variant="outline">
                Update
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm">
          <span className="text-muted-foreground">
            {completed.length}/{actions.length} completed
          </span>
          <div className="h-2 w-32 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-success transition-all"
              style={{ width: `${(completed.length / actions.length) * 100}%` }}
            />
          </div>
        </div>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Action
        </Button>
      </div>

      {pending.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Pending ({pending.length})
          </h3>
          <div className="space-y-3">
            {pending.map(renderActionCard)}
          </div>
        </div>
      )}

      {inProgress.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
            <Play className="h-4 w-4" />
            In Progress ({inProgress.length})
          </h3>
          <div className="space-y-3">
            {inProgress.map(renderActionCard)}
          </div>
        </div>
      )}

      {completed.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Completed ({completed.length})
          </h3>
          <div className="space-y-3">
            {completed.map(renderActionCard)}
          </div>
        </div>
      )}
    </div>
  )
}
