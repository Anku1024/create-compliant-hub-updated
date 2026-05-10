"use client"

import { useState } from "react"
import Link from "next/link"
import { format, differenceInDays } from "date-fns"
import { ArrowLeft, Edit2, Calendar, Clock, Check, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface Cap {
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
  thirty_day_deadline: string
  thirty_day_met: boolean
  thirty_day_response_date: string | null
  issuing_entity: string
}

interface Finding {
  id: string
  description: string
  severity: string
  status: string
}

interface Question {
  id: string
  question_number: number
  question_text: string
  answered: boolean
  answer_text: string | null
  ai_draft: string | null
  ai_confidence: number | null
  automation_level: string | null
}

interface Action {
  id: string
  title: string
  description: string
  owner: string
  due_date: string
  status: string
}

interface Document {
  id: string
  filename: string
  doc_type: string
  source: string
  file_size: number
  uploaded_at: string
}

interface Note {
  id: string
  author_name: string
  body: string
  created_at: string
}

interface Email {
  id: string
  subject: string
  from_address: string
  received_at: string
  preview: string
}

interface CapDetailContentProps {
  cap: Cap
  findings: Finding[]
  questions: Question[]
  actions: Action[]
  documents: Document[]
  notes: Note[]
  emails: Email[]
}

type TabType = "questions" | "findings" | "actions" | "emails" | "documents" | "notes"

export function CapDetailContent({
  cap,
  findings,
  questions,
  actions,
  documents,
  notes,
  emails,
}: CapDetailContentProps) {
  const [activeTab, setActiveTab] = useState<TabType>("questions")

  const now = new Date()
  const dueDate = new Date(cap.due_date)
  const issuedDate = new Date(cap.issued_date)
  const daysUntilDue = differenceInDays(dueDate, now)
  const isOverdue = daysUntilDue < 0 && cap.status !== "Closed"

  const answeredQuestions = questions.filter(q => q.answered).length
  const overdueActions = actions.filter(a => {
    return a.status !== "Completed" && new Date(a.due_date) < now
  }).length
  const completedActions = actions.filter(a => a.status === "Completed").length
  const openQuestions = questions.filter(q => !q.answered).length

  // Progress bar calculation
  const totalTasks = questions.length + actions.length
  const completedTasks = answeredQuestions + completedActions
  const progressPercent = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

  const tabs: { id: TabType; label: string; count?: number; badge?: string }[] = [
    { id: "questions", label: "Questions & answers", badge: openQuestions > 0 ? `${openQuestions} open` : undefined },
    { id: "findings", label: "Findings", count: findings.length },
    { id: "actions", label: "Actions", count: actions.length },
    { id: "emails", label: "Email thread" },
    { id: "documents", label: "Documents" },
    { id: "notes", label: "Notes" },
  ]

  return (
    <div className="p-6">
      {/* Back Link */}
      <Link 
        href="/" 
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to CAPs
      </Link>

      {/* Header Card */}
      <div className="bg-card border border-border rounded-lg p-6 mb-6">
        {/* Top Row */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl font-semibold">{cap.cap_number}</h1>
            <PriorityBadge priority={cap.priority} />
            <StatusBadge status={cap.status} />
            <ProgramBadge program={cap.program_area} />
            {overdueActions > 0 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border border-error/50 text-error bg-error/10">
                {overdueActions} overdue action{overdueActions > 1 ? "s" : ""}
              </span>
            )}
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Edit2 className="h-4 w-4" />
            Edit
          </Button>
        </div>

        {/* Title and Metadata */}
        <h2 className="text-lg font-medium mb-1">{cap.title}</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Issued by {cap.issuing_entity} · Assigned to: {cap.assigned_to ? "R. Patel" : "Unassigned"}
        </p>

        {/* Dates Row */}
        <div className="flex items-center gap-6 text-sm mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Issued:</span>
            <span className="font-medium">{format(issuedDate, "MMM d, yyyy")}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Due:</span>
            <span className={cn("font-medium", isOverdue && "text-error")}>
              {format(dueDate, "MMM d, yyyy")}
              {isOverdue && " (overdue)"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">30-day response:</span>
            {cap.thirty_day_met ? (
              <span className="text-success flex items-center gap-1">
                Met <Check className="h-3 w-3" />
                {cap.thirty_day_response_date && format(new Date(cap.thirty_day_response_date), "MMM d")}
              </span>
            ) : (
              <span className="text-warning">Pending</span>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-success transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-5 gap-4 mt-6 text-center">
          <div>
            <p className="text-2xl font-semibold">{findings.length}</p>
            <p className="text-xs text-muted-foreground">Findings</p>
          </div>
          <div>
            <p className={cn("text-2xl font-semibold", answeredQuestions < questions.length && "text-warning")}>
              {answeredQuestions}/{questions.length}
            </p>
            <p className="text-xs text-muted-foreground">Questions answered</p>
          </div>
          <div>
            <p className="text-2xl font-semibold">{actions.length}</p>
            <p className="text-xs text-muted-foreground">Actions</p>
          </div>
          <div>
            <p className={cn("text-2xl font-semibold", overdueActions > 0 && "text-error")}>
              {overdueActions}
            </p>
            <p className="text-xs text-muted-foreground">Overdue</p>
          </div>
          <div>
            <p className={cn("text-2xl font-semibold", completedActions > 0 && "text-success")}>
              {completedActions}
            </p>
            <p className="text-xs text-muted-foreground">Completed</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border mb-6">
        <div className="flex items-center gap-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "relative pb-3 text-sm font-medium transition-colors",
                activeTab === tab.id
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <span className="flex items-center gap-2">
                {tab.label}
                {tab.count !== undefined && (
                  <span className="text-muted-foreground">({tab.count})</span>
                )}
                {tab.badge && (
                  <span className="px-1.5 py-0.5 text-xs rounded bg-muted border border-border">
                    {tab.badge}
                  </span>
                )}
              </span>
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "questions" && <QuestionsTab questions={questions} />}
      {activeTab === "findings" && <FindingsTab findings={findings} />}
      {activeTab === "actions" && <ActionsTab actions={actions} />}
      {activeTab === "emails" && <EmailsTab emails={emails} />}
      {activeTab === "documents" && <DocumentsTab documents={documents} />}
      {activeTab === "notes" && <NotesTab notes={notes} />}
    </div>
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
      {priority} priority
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
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border border-primary/50 text-primary bg-primary/10">
      {program}
    </span>
  )
}

function FindingsTab({ findings }: { findings: Finding[] }) {
  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center gap-2 mb-4">
        <AlertCircle className="h-4 w-4 text-muted-foreground" />
        <h3 className="font-medium">DHCS findings</h3>
      </div>
      <div className="space-y-3">
        {findings.map((finding) => (
          <div key={finding.id} className="flex items-start justify-between py-2 border-b border-border last:border-0">
            <p className="text-sm text-foreground flex-1">{finding.description}</p>
            <span className={cn(
              "ml-4 px-2 py-0.5 rounded text-xs font-medium border shrink-0",
              finding.severity === "Critical" && "border-error/50 text-error bg-error/10",
              finding.severity === "Major" && "border-warning/50 text-warning bg-warning/10",
              finding.severity === "Minor" && "border-muted-foreground/50 text-muted-foreground bg-muted"
            )}>
              {finding.severity}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function QuestionsTab({ questions }: { questions: Question[] }) {
  return (
    <div className="space-y-4">
      {questions.map((question) => (
        <div key={question.id} className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-start justify-between mb-2">
            <span className="text-xs text-muted-foreground">Question {question.question_number}</span>
            {question.answered ? (
              <span className="text-xs text-success flex items-center gap-1">
                <Check className="h-3 w-3" /> Answered
              </span>
            ) : (
              <span className="text-xs text-warning">Pending</span>
            )}
          </div>
          <p className="text-sm font-medium mb-3">{question.question_text}</p>
          {question.ai_draft && !question.answered && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 mt-2">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-primary font-medium">AI Draft</span>
                {question.ai_confidence && (
                  <span className="text-xs text-muted-foreground">
                    {question.ai_confidence}% confidence
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{question.ai_draft}</p>
            </div>
          )}
          {question.answered && question.answer_text && (
            <div className="bg-muted rounded-lg p-3 mt-2">
              <p className="text-sm text-foreground">{question.answer_text}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function ActionsTab({ actions }: { actions: Action[] }) {
  const now = new Date()
  
  return (
    <div className="space-y-4">
      {actions.map((action) => {
        const dueDate = new Date(action.due_date)
        const isOverdue = action.status !== "Completed" && dueDate < now
        
        return (
          <div key={action.id} className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-medium text-sm">{action.title}</h4>
                <p className="text-xs text-muted-foreground mt-1">{action.description}</p>
                <div className="flex items-center gap-4 mt-2 text-xs">
                  <span className="text-muted-foreground">Owner: {action.owner}</span>
                  <span className={cn(isOverdue ? "text-error" : "text-muted-foreground")}>
                    Due: {format(dueDate, "MMM d, yyyy")}
                  </span>
                </div>
              </div>
              <span className={cn(
                "px-2 py-0.5 rounded text-xs font-medium border",
                action.status === "Completed" && "border-success/50 text-success bg-success/10",
                action.status === "In Progress" && "border-info/50 text-info bg-info/10",
                action.status === "Pending" && "border-muted-foreground/50 text-muted-foreground bg-muted"
              )}>
                {action.status}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function EmailsTab({ emails }: { emails: Email[] }) {
  if (emails.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-8 text-center">
        <p className="text-muted-foreground">No email threads for this CAP</p>
      </div>
    )
  }
  
  return (
    <div className="space-y-3">
      {emails.map((email) => (
        <div key={email.id} className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-start justify-between mb-2">
            <p className="font-medium text-sm">{email.subject}</p>
            <span className="text-xs text-muted-foreground">
              {format(new Date(email.received_at), "MMM d, yyyy")}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mb-2">From: {email.from_address}</p>
          <p className="text-sm text-muted-foreground">{email.preview}</p>
        </div>
      ))}
    </div>
  )
}

function DocumentsTab({ documents }: { documents: Document[] }) {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Filename</th>
            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Type</th>
            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Source</th>
            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Uploaded</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc) => (
            <tr key={doc.id} className="border-b border-border last:border-0">
              <td className="px-4 py-3 text-sm text-primary">{doc.filename}</td>
              <td className="px-4 py-3 text-sm text-muted-foreground capitalize">{doc.doc_type?.replace("_", " ")}</td>
              <td className="px-4 py-3 text-sm text-muted-foreground">{doc.source}</td>
              <td className="px-4 py-3 text-sm text-muted-foreground">
                {format(new Date(doc.uploaded_at), "MMM d, yyyy")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function NotesTab({ notes }: { notes: Note[] }) {
  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm">Internal notes</span>
      </div>
      
      <div className="space-y-4 mb-4">
        {notes.map((note) => (
          <div key={note.id} className="border-b border-border pb-4 last:border-0">
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium text-sm">{note.author_name}</span>
              <span className="text-xs text-muted-foreground">
                {format(new Date(note.created_at), "MMM d, yyyy")}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{note.body}</p>
          </div>
        ))}
      </div>
      
      <div className="space-y-3">
        <textarea
          placeholder="Add a note..."
          className="w-full h-24 rounded-lg border border-border bg-muted p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <Button size="sm">Add note</Button>
      </div>
    </div>
  )
}
