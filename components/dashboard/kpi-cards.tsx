import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AlertCircle,
  Clock,
  CalendarClock,
  HelpCircle,
  ListTodo,
  Mail,
} from "lucide-react"

interface KPICardsProps {
  openCaps: number
  pastDueCaps: number
  thirtyDayPending: number
  unansweredQuestions: number
  pendingActions: number
  newEmails: number
}

export function KPICards({
  openCaps,
  pastDueCaps,
  thirtyDayPending,
  unansweredQuestions,
  pendingActions,
  newEmails,
}: KPICardsProps) {
  const kpis = [
    {
      title: "Open CAPs",
      value: openCaps,
      icon: AlertCircle,
      description: "Active corrective action plans",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Past Due",
      value: pastDueCaps,
      icon: Clock,
      description: "Overdue CAPs requiring attention",
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
    {
      title: "30-Day Pending",
      value: thirtyDayPending,
      icon: CalendarClock,
      description: "Responses due within 30 days",
      color: "text-warning-foreground",
      bgColor: "bg-warning/10",
    },
    {
      title: "Unanswered Questions",
      value: unansweredQuestions,
      icon: HelpCircle,
      description: "Questions awaiting response",
      color: "text-info",
      bgColor: "bg-info/10",
    },
    {
      title: "Pending Actions",
      value: pendingActions,
      icon: ListTodo,
      description: "Corrective actions not started",
      color: "text-muted-foreground",
      bgColor: "bg-muted",
    },
    {
      title: "New Emails",
      value: newEmails,
      icon: Mail,
      description: "Unread DHCS communications",
      color: "text-success",
      bgColor: "bg-success/10",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {kpis.map((kpi) => (
        <Card key={kpi.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
            <div className={`rounded-full p-2 ${kpi.bgColor}`}>
              <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpi.value}</div>
            <p className="text-xs text-muted-foreground">{kpi.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
