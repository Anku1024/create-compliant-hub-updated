import { createClient } from "@/lib/supabase/server"
import { CapsPageContent } from "@/components/caps/caps-page-content"

export default async function CapsPage() {
  const supabase = await createClient()
  
  // Fetch CAPs with related data
  const { data: caps } = await supabase
    .from("caps")
    .select("*")
    .order("issued_date", { ascending: false })

  // Fetch questions count per CAP
  const { data: questions } = await supabase
    .from("questions")
    .select("cap_id, answered")

  // Fetch actions count per CAP
  const { data: actions } = await supabase
    .from("actions")
    .select("cap_id, status, due_date")

  // Fetch findings count per CAP
  const { data: findings } = await supabase
    .from("findings")
    .select("cap_id, severity, status")

  // Fetch recent email
  const { data: recentEmail } = await supabase
    .from("email_threads")
    .select("*")
    .eq("is_new", true)
    .order("received_at", { ascending: false })
    .limit(1)
    .single()

  return (
    <CapsPageContent 
      caps={caps || []} 
      questions={questions || []}
      actions={actions || []}
      findings={findings || []}
      recentEmail={recentEmail}
    />
  )
}
