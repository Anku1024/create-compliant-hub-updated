"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FindingsTab } from "./tabs/findings-tab"
import { QuestionsTab } from "./tabs/questions-tab"
import { ActionsTab } from "./tabs/actions-tab"
import { DocumentsTab } from "./tabs/documents-tab"
import { NotesTab } from "./tabs/notes-tab"
import type { CAP, Finding, Question, Action, Document, Note } from "@/lib/types"
import { AlertTriangle, HelpCircle, ListTodo, FileText, MessageSquare } from "lucide-react"

interface CAPTabsProps {
  cap: CAP
  findings: Finding[]
  questions: Question[]
  actions: Action[]
  documents: Document[]
  notes: Note[]
}

export function CAPTabs({
  cap,
  findings,
  questions,
  actions,
  documents,
  notes,
}: CAPTabsProps) {
  const unansweredQuestions = questions.filter((q) => !q.answered).length
  const pendingActions = actions.filter((a) => a.status === "Pending").length
  const openFindings = findings.filter((f) => f.status === "Open").length

  return (
    <Tabs defaultValue="findings" className="space-y-6">
      <TabsList className="bg-muted/50 p-1">
        <TabsTrigger value="findings" className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          Findings
          {openFindings > 0 && (
            <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive/10 text-xs font-medium text-destructive">
              {openFindings}
            </span>
          )}
        </TabsTrigger>
        <TabsTrigger value="questions" className="flex items-center gap-2">
          <HelpCircle className="h-4 w-4" />
          Questions
          {unansweredQuestions > 0 && (
            <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-warning/10 text-xs font-medium text-warning-foreground">
              {unansweredQuestions}
            </span>
          )}
        </TabsTrigger>
        <TabsTrigger value="actions" className="flex items-center gap-2">
          <ListTodo className="h-4 w-4" />
          Actions
          {pendingActions > 0 && (
            <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-muted text-xs font-medium">
              {pendingActions}
            </span>
          )}
        </TabsTrigger>
        <TabsTrigger value="documents" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Documents
          <span className="ml-1 text-xs text-muted-foreground">({documents.length})</span>
        </TabsTrigger>
        <TabsTrigger value="notes" className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          Notes
          <span className="ml-1 text-xs text-muted-foreground">({notes.length})</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="findings">
        <FindingsTab findings={findings} />
      </TabsContent>

      <TabsContent value="questions">
        <QuestionsTab questions={questions} capId={cap.id} />
      </TabsContent>

      <TabsContent value="actions">
        <ActionsTab actions={actions} />
      </TabsContent>

      <TabsContent value="documents">
        <DocumentsTab documents={documents} />
      </TabsContent>

      <TabsContent value="notes">
        <NotesTab notes={notes} capId={cap.id} />
      </TabsContent>
    </Tabs>
  )
}
