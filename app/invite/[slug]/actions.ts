"use server"

import { createAdminClient } from "@/lib/supabase/admin"
import { phonesMatch } from "@/lib/utils-wedding"

export type VerifyResult =
  | { ok: true }
  | { ok: false; error: string }

// Verify that the entered phone matches the invited guest for this slug.
export async function verifyPhone(slug: string, phone: string): Promise<VerifyResult> {
  if (!phone.trim()) return { ok: false, error: "Please enter your phone number." }

  const supabase = createAdminClient()
  const { data, error } = await supabase.from("guests").select("phone").eq("slug", slug).single()

  if (error || !data) return { ok: false, error: "We couldn't find your invitation." }
  if (!phonesMatch(data.phone, phone)) {
    return { ok: false, error: "That number doesn't match our guest list. Please try the number you received this invite on." }
  }
  return { ok: true }
}

export type RsvpInput = {
  slug: string
  phone: string
  status: "attending" | "declined"
  guestCount: number
  guestNames: string[]
  message: string
}

export type RsvpResult =
  | { ok: true }
  | { ok: false; error: string }

export async function submitRsvp(input: RsvpInput): Promise<RsvpResult> {
  const supabase = createAdminClient()
  console.log(input)

  const { data: guest, error } = await supabase
    .from("guests")
    .select("id, phone, max_guests")
    .eq("slug", input.slug)
    .single()

  if (error || !guest) return { ok: false, error: "We couldn't find your invitation." }

  // Re-verify phone server-side so RSVP can't be forged by skipping the gate.
  if (!phonesMatch(guest.phone, input.phone)) {
    return { ok: false, error: "Phone verification failed. Please verify again." }
  }

  let guestCount = 0
  let guestNames: string[] = []

  if (input.status === "attending") {
    guestCount = Math.max(1, Math.min(input.guestCount || 1, guest.max_guests))
    guestNames = input.guestNames
      .map((n) => n.trim())
      .filter(Boolean)
      .slice(0, guestCount)
  }

  const { error: updateError } = await supabase
    .from("guests")
    .update({
      rsvp_status: input.status,
      guest_count: guestCount,
      guest_names: guestNames,
      message: input.message.trim() || null,
      responded_at: new Date().toISOString(),
    })
    .eq("id", guest.id)

  if (updateError) return { ok: false, error: "Something went wrong saving your response. Please try again." }

  return { ok: true }
}
