import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { createAdminClient } from "@/lib/supabase/admin"
import { Invitation } from "@/components/invitation"
import { wedding } from "@/lib/wedding"

type Props = { params: Promise<{ slug: string }> }

async function getGuest(slug: string) {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from("guests")
    .select("slug, name, max_guests, rsvp_status, guest_count, guest_names, message")
    .eq("slug", slug)
    .single()
  return data
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const guest = await getGuest(slug)
  const title = guest
    ? `${guest.name}, you're invited — ${wedding.partnerA} & ${wedding.partnerB}`
    : `${wedding.partnerA} & ${wedding.partnerB} Wedding`
  const description = `Join us on ${wedding.dateLong} at ${wedding.venue}. Kindly RSVP.`
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: ["/wedding/hero.png"],
      type: "website",
    },
    twitter: { card: "summary_large_image", title, description, images: ["/wedding/hero.png"] },
  }
}

export default async function InvitePage({ params }: Props) {
  const { slug } = await params
  const guest = await getGuest(slug)
  if (!guest) notFound()

  return (
    <Invitation
      guest={{
        slug: guest.slug,
        name: guest.name,
        max_guests: guest.max_guests,
        rsvp_status: guest.rsvp_status,
        guest_count: guest.guest_count,
        guest_names: guest.guest_names ?? [],
        message: guest.message,
      }}
    />
  )
}
