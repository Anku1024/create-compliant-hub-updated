"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getSeverityColor } from "@/lib/utils"
import type { Finding } from "@/lib/types"
import { AlertTriangle, CheckCircle } from "lucide-react"

interface FindingsTabProps {
  findings: Finding[]
}

export function FindingsTab({ findings }: FindingsTabProps) {
  if (findings.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <AlertTriangle className="h-12 w-12 text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground">No findings recorded</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {findings.map((finding, index) => (
        <Card key={finding.id}>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium">
                  {index + 1}
                </span>
                <div>
                  {finding.mhp_code && (
                    <span className="font-mono text-sm text-muted-foreground">
                      {finding.mhp_code}
                    </span>
                  )}
                  <Badge className={`ml-2 ${getSeverityColor(finding.severity)}`} variant="secondary">
                    {finding.severity}
                  </Badge>
                </div>
              </div>
              <Badge
                variant="secondary"
                className={finding.status === "Resolved" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}
              >
                {finding.status === "Resolved" ? (
                  <CheckCircle className="h-3 w-3 mr-1" />
                ) : (
                  <AlertTriangle className="h-3 w-3 mr-1" />
                )}
                {finding.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{finding.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
