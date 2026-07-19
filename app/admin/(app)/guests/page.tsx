import { createClient } from "@/lib/supabase/server"
import { UploadForm } from "@/components/upload-form"
import { GuestTable } from "@/components/guest-table"
import type { Guest } from "@/lib/wedding"

export default async function GuestsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data } = await supabase
    .from("guests")
    .select("*")
    .eq("admin_id", user!.id)
    .order("created_at", { ascending: false })

  const guests = (data ?? []) as Guest[]

  return (
    <div className="flex flex-col gap-10">
      <div>
        <p className="text-xs uppercase tracking-luxe text-muted-foreground">Data Entry</p>
        <h1 className="mt-2 font-heading text-4xl text-foreground">Guests &amp; Invitations</h1>
      </div>
      <UploadForm />
      <GuestTable guests={guests} />
    </div>
  )
}
