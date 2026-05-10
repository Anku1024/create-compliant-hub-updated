import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { CapDetailContent } from "@/components/caps/cap-detail-content"

interface CAPDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function CAPDetailPage({ params }: CAPDetailPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const [capResult, findingsResult, questionsResult, actionsResult, documentsResult, notesResult, emailsResult] =
    await Promise.all([
      supabase.from("caps").select("*").eq("id", id).single(),
      supabase.from("findings").select("*").eq("cap_id", id).order("created_at"),
      supabase.from("questions").select("*").eq("cap_id", id).order("question_number"),
      supabase.from("actions").select("*").eq("cap_id", id).order("due_date"),
      supabase.from("documents").select("*").eq("cap_id", id).order("uploaded_at", { ascending: false }),
      supabase.from("notes").select("*").eq("cap_id", id).order("created_at", { ascending: false }),
      supabase.from("email_threads").select("*").eq("cap_id", id).order("received_at", { ascending: false }),
    ])

  if (!capResult.data) {
    notFound()
  }

  return (
    <CapDetailContent
      cap={capResult.data}
      findings={findingsResult.data || []}
      questions={questionsResult.data || []}
      actions={actionsResult.data || []}
      documents={documentsResult.data || []}
      notes={notesResult.data || []}
      emails={emailsResult.data || []}
    />
  )
}
