"use client"

import type React from "react"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { parseContacts } from "@/lib/utils-wedding"
import { addContacts } from "@/app/admin/actions"
import { Ornament } from "@/components/ornament"
import { toast } from "sonner"
import { Loader2, Upload } from "lucide-react"

const PLACEHOLDER = `Amara Okafor, +1 555 010 2233, 2
Julian Reyes, 5550104455
Mr. & Mrs. Bennett, +1 555 992 8181, 4`

export function UploadForm() {
  const [raw, setRaw] = useState("")
  const [isPending, startTransition] = useTransition()
  const [fileName, setFileName] = useState<string | null>(null)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = () => {
      const text = String(reader.result ?? "")
      // For CSVs, strip a possible header row containing "name"
      const lines = text.split("\n")
      if (lines[0]?.toLowerCase().includes("name") && lines[0]?.toLowerCase().includes("phone")) {
        lines.shift()
      }
      setRaw(lines.join("\n"))
    }
    reader.readAsText(file)
  }

  const handleSubmit = () => {
    const { contacts, errors } = parseContacts(raw)
    if (errors.length) {
      toast.error(`${errors.length} line(s) need attention`, { description: errors.slice(0, 3).join(" · ") })
    }
    if (!contacts.length) {
      toast.error("No valid contacts to add")
      return
    }

    startTransition(async () => {
      const result = await addContacts(contacts)
      if (!result.success) {
        toast.error(result.error ?? "Something went wrong")
        return
      }
      toast.success(`Added ${result.added} invitation${result.added === 1 ? "" : "s"}`, {
        description: result.skipped ? `${result.skipped} duplicate(s) skipped` : "Unique links generated for each guest",
      })
      setRaw("")
      setFileName(null)
    })
  }

  const previewCount = parseContacts(raw).contacts.length

  return (
    <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
      <Ornament label="Add Guests" className="justify-start" />
      <h2 className="mt-4 font-heading text-3xl text-foreground">Upload your guest list</h2>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
        Paste one guest per line as <span className="font-mono text-foreground">Name, Phone, MaxGuests</span>. Max guests
        is optional and defaults to 1. A unique invitation link is generated for everyone automatically.
      </p>

      <div className="mt-6 grid gap-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="contacts">Guest list</Label>
          <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-primary hover:text-gold">
            <Upload className="h-4 w-4" />
            <span>{fileName ?? "Import .csv / .txt"}</span>
            <input type="file" accept=".csv,.txt" className="sr-only" onChange={handleFile} />
          </label>
        </div>
        <Textarea
          id="contacts"
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          placeholder={PLACEHOLDER}
          rows={10}
          className="font-mono text-sm"
        />
      </div>

      <div className="mt-5 flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          {previewCount > 0 ? (
            <span>
              <span className="font-medium text-foreground">{previewCount}</span> valid guest
              {previewCount === 1 ? "" : "s"} ready
            </span>
          ) : (
            "Awaiting your list"
          )}
        </p>
        <Button onClick={handleSubmit} disabled={isPending || previewCount === 0} className="min-w-44">
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating links...
            </>
          ) : (
            "Generate invitations"
          )}
        </Button>
      </div>
    </div>
  )
}
