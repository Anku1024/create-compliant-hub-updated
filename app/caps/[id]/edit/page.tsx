import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { CAPEditForm } from "@/components/caps/cap-edit-form"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

interface CAPEditPageProps {
  params: Promise<{ id: string }>
}

export default async function CAPEditPage({ params }: CAPEditPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: cap } = await supabase
    .from("caps")
    .select("*")
    .eq("id", id)
    .single()

  if (!cap) {
    notFound()
  }

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <Link
          href={`/caps/${id}`}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to {cap.cap_number}
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Edit CAP</h1>
        <p className="text-muted-foreground">
          Update details for {cap.cap_number}
        </p>
      </div>

      <CAPEditForm cap={cap} />
    </div>
  )
}
