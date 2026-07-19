import Link from "next/link"
import { signOut } from "@/app/admin/auth-actions"
import { Button } from "@/components/ui/button"
import { Monogram } from "@/components/ornament"

export function AdminNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/admin" className="flex items-center gap-3">
          <Monogram className="h-10 w-10 text-sm" />
          <div className="leading-tight">
            <p className="font-heading text-lg text-foreground">Wedding Admin</p>
            <p className="text-[11px] uppercase tracking-luxe text-muted-foreground">RSVP Management</p>
          </div>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          <Button variant="ghost" size="sm">
            <Link href="/admin">Dashboard</Link>
          </Button>
          <Button variant="ghost" size="sm">
            <Link href="/admin/guests">Guests</Link>
          </Button>
          <form action={signOut}>
            <Button type="submit" variant="outline" size="sm">
              Sign out
            </Button>
          </form>
        </nav>
      </div>
    </header>
  )
}
