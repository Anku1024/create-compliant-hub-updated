export type CAP = {
  id: string
  cap_number: string
  title: string
  description: string | null
  program_area: "Mental Health" | "SUD" | "Access & Timeliness" | "Quality Improvement"
  priority: "High" | "Medium" | "Low"
  status: "Open" | "In Progress" | "Submitted" | "Closed"
  assigned_to: string | null
  issued_date: string
  due_date: string
  thirty_day_deadline: string
  issuing_entity: string
  summary: string | null
  thirty_day_met: boolean
  thirty_day_response_date: string | null
  created_at: string
  updated_at: string
}

export type Finding = {
  id: string
  cap_id: string
  description: string
  severity: "Critical" | "Major" | "Minor"
  mhp_code: string | null
  status: "Open" | "Resolved"
  created_at: string
}

export type Question = {
  id: string
  cap_id: string
  question_number: number
  question_text: string
  finding_reference: string | null
  automation_level: "Full Auto" | "Semi-Auto" | "AI Draft" | "Human Required" | null
  ai_draft: string | null
  ai_source_cap: string | null
  ai_confidence: number | null
  answered: boolean
  answer_text: string | null
  answered_by: string | null
  answered_at: string | null
  created_at: string
  updated_at: string
}

export type Action = {
  id: string
  cap_id: string
  title: string
  description: string | null
  owner: string
  due_date: string
  status: "Completed" | "In Progress" | "Pending"
  completed_at: string | null
  created_at: string
  updated_at: string
}

export type Document = {
  id: string
  cap_id: string
  filename: string
  storage_path: string
  file_size: number | null
  doc_type: "dhcs_issued" | "response" | "evidence" | "other" | null
  source: "DHCS" | "Internal" | null
  uploaded_by: string | null
  uploaded_at: string
}

export type EmailThread = {
  id: string
  cap_id: string | null
  from_address: string
  subject: string
  received_at: string
  preview: string | null
  raw_body: string | null
  direction: "inbound" | "outbound"
  is_new: boolean
  classification: "cap_notice" | "webinar" | "general" | "unknown" | null
  created_at: string
}

export type Note = {
  id: string
  cap_id: string
  author_id: string | null
  author_name: string
  body: string
  created_at: string
}

export type CAPWithRelations = CAP & {
  findings: Finding[]
  questions: Question[]
  actions: Action[]
  documents: Document[]
  notes: Note[]
}
