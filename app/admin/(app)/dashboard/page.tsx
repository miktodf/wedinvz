import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Dashboard, type GuestRow } from "@/components/dashboard"

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/admin/login")

  const { data } = await supabase
    .from("guests")
    .select("id, name, phone, slug, max_guests, rsvp_status, guest_count, guest_names, message, responded_at")
    .eq("admin_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <Dashboard initialGuests={(data as GuestRow[]) ?? []} />
    </div>
  )
}
