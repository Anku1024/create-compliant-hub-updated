"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"
import type { Document } from "@/lib/types"
import { FileText, Download, Upload, File, FileSpreadsheet, FileImage, Plus } from "lucide-react"

interface DocumentsTabProps {
  documents: Document[]
}

function getFileIcon(filename: string) {
  const ext = filename.split(".").pop()?.toLowerCase()
  switch (ext) {
    case "pdf":
      return FileText
    case "xlsx":
    case "xls":
    case "csv":
      return FileSpreadsheet
    case "png":
    case "jpg":
    case "jpeg":
      return FileImage
    default:
      return File
  }
}

function formatFileSize(bytes: number | null) {
  if (!bytes) return "—"
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function getDocTypeLabel(docType: string | null) {
  switch (docType) {
    case "dhcs_issued":
      return "DHCS Issued"
    case "response":
      return "Response"
    case "evidence":
      return "Evidence"
    case "other":
      return "Other"
    default:
      return "Document"
  }
}

function getDocTypeColor(docType: string | null) {
  switch (docType) {
    case "dhcs_issued":
      return "bg-primary/10 text-primary"
    case "response":
      return "bg-success/10 text-success"
    case "evidence":
      return "bg-info/10 text-info"
    default:
      return "bg-muted text-muted-foreground"
  }
}

export function DocumentsTab({ documents }: DocumentsTabProps) {
  // Group by type
  const dhcsIssued = documents.filter((d) => d.doc_type === "dhcs_issued")
  const responses = documents.filter((d) => d.doc_type === "response")
  const evidence = documents.filter((d) => d.doc_type === "evidence")
  const other = documents.filter((d) => d.doc_type === "other" || !d.doc_type)

  const renderDocumentCard = (doc: Document) => {
    const FileIcon = getFileIcon(doc.filename)

    return (
      <Card key={doc.id} className="group hover:shadow-md transition-all">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-muted">
              <FileIcon className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{doc.filename}</p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                <span>{formatFileSize(doc.file_size)}</span>
                <span>{formatDate(doc.uploaded_at)}</span>
                {doc.source && (
                  <Badge variant="outline" className="text-xs">
                    {doc.source}
                  </Badge>
                )}
              </div>
            </div>
            <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (documents.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground mb-4">No documents uploaded</p>
          <Button>
            <Upload className="h-4 w-4 mr-2" />
            Upload Document
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button size="sm">
          <Upload className="h-4 w-4 mr-2" />
          Upload Document
        </Button>
      </div>

      {dhcsIssued.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
            <Badge variant="secondary" className={getDocTypeColor("dhcs_issued")}>
              {getDocTypeLabel("dhcs_issued")}
            </Badge>
            <span>({dhcsIssued.length})</span>
          </h3>
          <div className="grid gap-3 md:grid-cols-2">
            {dhcsIssued.map(renderDocumentCard)}
          </div>
        </div>
      )}

      {responses.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
            <Badge variant="secondary" className={getDocTypeColor("response")}>
              {getDocTypeLabel("response")}
            </Badge>
            <span>({responses.length})</span>
          </h3>
          <div className="grid gap-3 md:grid-cols-2">
            {responses.map(renderDocumentCard)}
          </div>
        </div>
      )}

      {evidence.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
            <Badge variant="secondary" className={getDocTypeColor("evidence")}>
              {getDocTypeLabel("evidence")}
            </Badge>
            <span>({evidence.length})</span>
          </h3>
          <div className="grid gap-3 md:grid-cols-2">
            {evidence.map(renderDocumentCard)}
          </div>
        </div>
      )}

      {other.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
            <Badge variant="secondary" className={getDocTypeColor("other")}>
              Other
            </Badge>
            <span>({other.length})</span>
          </h3>
          <div className="grid gap-3 md:grid-cols-2">
            {other.map(renderDocumentCard)}
          </div>
        </div>
      )}
    </div>
  )
}
