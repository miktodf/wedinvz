"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { deleteGuest } from "@/app/admin/actions"
import type { Guest } from "@/lib/wedding"
import { toast } from "sonner"
import { Copy, Check, Trash2, Search, ExternalLink } from "lucide-react"
import Link from "next/link"

function StatusBadge({ status }: { status: Guest["rsvp_status"] }) {
  if (status === "attending")
    return <Badge className="bg-primary text-primary-foreground hover:bg-primary">Attending</Badge>
  if (status === "declined")
    return <Badge variant="outline" className="border-destructive/40 text-destructive">Declined</Badge>
  return (
    <Badge variant="outline" className="border-gold/50 text-muted-foreground">
      Pending
    </Badge>
  )
}

export function GuestTable({ guests }: { guests: Guest[] }) {
  const [query, setQuery] = useState("")
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const filtered = guests.filter(
    (g) => g.name.toLowerCase().includes(query.toLowerCase()) || g.phone.includes(query),
  )

  const copyLink = async (slug: string, id: string) => {
    const url = `${window.location.origin}/invite/${slug}`
    try {
      await navigator.clipboard.writeText(url)
      setCopiedId(id)
      toast.success("Invitation link copied")
      setTimeout(() => setCopiedId(null), 1800)
    } catch {
      toast.error("Could not copy. Link: " + url)
    }
  }

  const remove = (id: string, name: string) => {
    startTransition(async () => {
      const res = await deleteGuest(id)
      if (res.success) toast.success(`Removed ${name}`)
      else toast.error(res.error ?? "Could not remove guest")
    })
  }

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-heading text-2xl text-foreground">
          All guests <span className="text-muted-foreground">({guests.length})</span>
        </p>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search name or phone"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Guest</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Party</TableHead>
              <TableHead className="text-right">Invitation</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                  {guests.length === 0 ? "No guests yet. Add your list above." : "No matches found."}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((g) => (
                <TableRow key={g.id}>
                  <TableCell>
                    <div className="font-medium text-foreground">{g.name}</div>
                    {g.rsvp_status === "attending" && g.guest_names.length > 0 && (
                      <div className="text-xs text-muted-foreground">{g.guest_names.join(", ")}</div>
                    )}
                  </TableCell>
                  <TableCell className="font-mono text-sm text-muted-foreground">{g.phone}</TableCell>
                  <TableCell>
                    <StatusBadge status={g.rsvp_status} />
                  </TableCell>
                  <TableCell className="text-center">
                    {g.rsvp_status === "attending" ? (
                      <span className="font-medium text-foreground">{g.guest_count}</span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                    <span className="text-xs text-muted-foreground"> / {g.max_guests}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyLink(g.slug, g.id)}
                        title="Copy invitation link"
                      >
                        {copiedId === g.id ? (
                          <Check className="h-4 w-4 text-primary" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                      <Button variant="ghost" size="icon" title="Open invitation">
                        <Link href={`/invite/${g.slug}`} target="_blank">
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={isPending}
                        onClick={() => remove(g.id, g.name)}
                        title="Remove guest"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
