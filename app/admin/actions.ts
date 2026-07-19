"use server"

import { createClient } from "@/lib/supabase/server"
import { generateSlug, normalizePhone, type ParsedContact } from "@/lib/utils-wedding"
import { revalidatePath } from "next/cache"

export type AddContactsResult = {
  success: boolean
  added: number
  skipped: number
  error?: string
}

export async function addContacts(contacts: ParsedContact[]): Promise<AddContactsResult> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { success: false, added: 0, skipped: 0, error: "Not authenticated" }
  if (!contacts.length) return { success: false, added: 0, skipped: 0, error: "No valid contacts provided" }

  // Skip duplicates already in this admin's list (by phone).
  const { data: existing } = await supabase.from("guests").select("phone").eq("admin_id", user.id)
  const existingPhones = new Set((existing ?? []).map((g) => normalizePhone(g.phone)))

  const rows = contacts
    .filter((c) => !existingPhones.has(normalizePhone(c.phone)))
    .map((c) => ({
      admin_id: user.id,
      slug: generateSlug(),
      name: c.name,
      phone: normalizePhone(c.phone),
      max_guests: c.maxGuests,
    }))

  const skipped = contacts.length - rows.length
  if (!rows.length) return { success: true, added: 0, skipped }

  const { error } = await supabase.from("guests").insert(rows)
  if (error) return { success: false, added: 0, skipped, error: error.message }

  revalidatePath("/admin")
  revalidatePath("/admin/guests")
  return { success: true, added: rows.length, skipped }
}

export async function deleteGuest(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: "Not authenticated" }

  const { error } = await supabase.from("guests").delete().eq("id", id).eq("admin_id", user.id)
  if (error) return { success: false, error: error.message }

  revalidatePath("/admin")
  revalidatePath("/admin/guests")
  return { success: true }
}
