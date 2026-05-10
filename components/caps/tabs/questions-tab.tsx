"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Question } from "@/lib/types"
import { HelpCircle, CheckCircle, Sparkles, Edit, ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"

interface QuestionsTabProps {
  questions: Question[]
  capId: string
}

function getAutomationColor(level: string | null) {
  switch (level) {
    case "Full Auto":
      return "bg-success/10 text-success"
    case "AI Draft":
      return "bg-info/10 text-info"
    case "Semi-Auto":
      return "bg-warning/10 text-warning-foreground"
    case "Human Required":
      return "bg-muted text-muted-foreground"
    default:
      return "bg-muted text-muted-foreground"
  }
}

export function QuestionsTab({ questions, capId }: QuestionsTabProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  if (questions.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <HelpCircle className="h-12 w-12 text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground">No questions for this CAP</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {questions.map((question) => (
        <Card key={question.id} className={question.answered ? "border-success/30" : ""}>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                  Q{question.question_number}
                </span>
                <div className="flex-1">
                  <p className="font-medium">{question.question_text}</p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    {question.finding_reference && (
                      <Badge variant="outline" className="text-xs">
                        Ref: {question.finding_reference}
                      </Badge>
                    )}
                    {question.automation_level && (
                      <Badge variant="secondary" className={getAutomationColor(question.automation_level)}>
                        <Sparkles className="h-3 w-3 mr-1" />
                        {question.automation_level}
                      </Badge>
                    )}
                    {question.ai_confidence && (
                      <span className="text-xs text-muted-foreground">
                        {question.ai_confidence}% confidence
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {question.answered ? (
                  <Badge variant="secondary" className="bg-success/10 text-success">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Answered
                  </Badge>
                ) : (
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4 mr-1" />
                    Answer
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>

          {/* AI Draft or Answer */}
          {(question.ai_draft || question.answer_text) && (
            <CardContent className="pt-0">
              <button
                onClick={() => setExpandedId(expandedId === question.id ? null : question.id)}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {expandedId === question.id ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
                {question.answered ? "View Answer" : "View AI Draft"}
              </button>

              {expandedId === question.id && (
                <div className="mt-3 rounded-lg bg-muted/50 p-4">
                  {question.answered ? (
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">Final Answer:</p>
                      <p className="text-sm">{question.answer_text}</p>
                    </div>
                  ) : question.ai_draft ? (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="h-4 w-4 text-info" />
                        <p className="text-xs text-muted-foreground">
                          AI Draft
                          {question.ai_source_cap && ` (based on ${question.ai_source_cap})`}
                        </p>
                      </div>
                      <p className="text-sm">{question.ai_draft}</p>
                      <div className="flex gap-2 mt-4">
                        <Button size="sm">Accept Draft</Button>
                        <Button size="sm" variant="outline">Edit Draft</Button>
                      </div>
                    </div>
                  ) : null}
                </div>
              )}
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  )
}
