import { createClient } from "@/lib/supabase/server"
import { CAPsList } from "@/components/caps/caps-list"
import { CAPsFilters } from "@/components/caps/caps-filters"

export default async function CAPsPage() {
  const supabase = await createClient()

  const { data: caps } = await supabase
    .from("caps")
    .select("*")
    .order("due_date", { ascending: true })

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">CAPs</h1>
        <p className="text-muted-foreground">
          Manage corrective action plans and track compliance status
        </p>
      </div>

      <CAPsFilters />
      <CAPsList caps={caps || []} />
    </div>
  )
}
