"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Check, X, Clock } from "lucide-react"

export type GuestRow = {
  id: string
  name: string
  phone: string
  slug: string
  max_guests: number
  rsvp_status: "pending" | "attending" | "declined"
  guest_count: number
  guest_names: string[]
  message: string | null
  responded_at: string | null
}

function computeStats(guests: GuestRow[]) {
  const attending = guests.filter((g) => g.rsvp_status === "attending")
  const declined = guests.filter((g) => g.rsvp_status === "declined")
  const pending = guests.filter((g) => g.rsvp_status === "pending")
  const headcount = attending.reduce((sum, g) => sum + (g.guest_count || 0), 0)
  return {
    total: guests.length,
    attending: attending.length,
    declined: declined.length,
    pending: pending.length,
    headcount,
  }
}

export function Dashboard({ initialGuests }: { initialGuests: GuestRow[] }) {
  const [guests, setGuests] = useState<GuestRow[]>(initialGuests)
  const [live, setLive] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    const channel = supabase
      .channel("guests-dashboard")
      .on("postgres_changes", { event: "*", schema: "public", table: "guests" }, (payload) => {
        setGuests((prev) => {
          if (payload.eventType === "INSERT") {
            const row = payload.new as GuestRow
            if (prev.some((g) => g.id === row.id)) return prev
            return [row, ...prev]
          }
          if (payload.eventType === "UPDATE") {
            const row = payload.new as GuestRow
            return prev.map((g) => (g.id === row.id ? { ...g, ...row } : g))
          }
          if (payload.eventType === "DELETE") {
            const oldRow = payload.old as { id: string }
            return prev.filter((g) => g.id !== oldRow.id)
          }
          return prev
        })
      })
      .subscribe((status) => {
        setLive(status === "SUBSCRIBED")
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const stats = computeStats(guests)
  const responded = stats.attending + stats.declined
  const rate = stats.total > 0 ? Math.round((responded / stats.total) * 100) : 0

  const cards = [
    { label: "Total Invited", value: stats.total, icon: Users, tone: "text-foreground" },
    { label: "Attending", value: stats.attending, icon: Check, tone: "text-primary" },
    { label: "Declined", value: stats.declined, icon: X, tone: "text-destructive" },
    { label: "Pending", value: stats.pending, icon: Clock, tone: "text-muted-foreground" },
  ]

  const recent = [...guests]
    .filter((g) => g.responded_at)
    .sort((a, b) => new Date(b.responded_at!).getTime() - new Date(a.responded_at!).getTime())
    .slice(0, 8)

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-foreground">RSVP Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">Live overview of your guest responses</p>
        </div>
        <Badge
          variant="outline"
          className="gap-2 border-primary/30 text-xs font-normal text-muted-foreground"
        >
          <span
            className={`h-2 w-2 rounded-full ${live ? "bg-primary animate-pulse" : "bg-muted-foreground/40"}`}
            aria-hidden
          />
          {live ? "Live" : "Connecting…"}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c) => {
          const Icon = c.icon
          return (
            <Card key={c.label} className="flex flex-col gap-3 p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{c.label}</span>
                <Icon className={`h-4 w-4 ${c.tone}`} aria-hidden />
              </div>
              <span className={`font-serif text-4xl ${c.tone}`}>{c.value}</span>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="flex flex-col gap-4 p-6 lg:col-span-1">
          <h2 className="text-sm font-medium text-foreground">Confirmed Headcount</h2>
          <div className="flex items-end gap-2">
            <span className="font-serif text-5xl text-primary">{stats.headcount}</span>
            <span className="mb-2 text-sm text-muted-foreground">guests</span>
          </div>
          <div className="mt-2">
            <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
              <span>Response rate</span>
              <span>{rate}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all duration-700"
                style={{ width: `${rate}%` }}
              />
            </div>
          </div>
        </Card>

        <Card className="flex flex-col gap-4 p-6 lg:col-span-2">
          <h2 className="text-sm font-medium text-foreground">Recent Responses</h2>
          {recent.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No responses yet. Share your invitation links to get started.
            </p>
          ) : (
            <ul className="flex flex-col divide-y divide-border">
              {recent.map((g) => (
                <li key={g.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm text-foreground">{g.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {g.rsvp_status === "attending"
                        ? `Attending · ${g.guest_count} ${g.guest_count === 1 ? "guest" : "guests"}`
                        : "Declined"}
                    </p>
                  </div>
                  <Badge
                    variant={g.rsvp_status === "attending" ? "default" : "secondary"}
                    className={
                      g.rsvp_status === "attending"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }
                  >
                    {g.rsvp_status === "attending" ? "Yes" : "No"}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  )
}
