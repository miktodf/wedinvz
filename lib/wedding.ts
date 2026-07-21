// Edit these details to personalize your wedding invitation.
export const wedding = {
  brideName: "Olga",
  groomName: "Miguel",
  // Aliases used by the guest invitation page
  partnerA: "Olga",
  partnerB: "Miguel",
  coupleNames: "Olga & Miguel",
  date: "Sábado, Primero de Agosto de 2026",
  dateLong: "Sábado, 1 de Agosto de 2026",
  dateShort: "Agosto 1, 2026",
  shortDate: "01 . 08 . 2026",
  time: "De las cinco de la tarde en adelante",
  ceremonyVenue: "Aloft Hotel - Rooftop",
  ceremonyAddress: "Barrio Río de Piedras, 18 Avenida S, 6 y 7 Calle S, 21104 San Pedro Sula, Honduras",
  // Combined venue label used on the invitation
  venue: "Aloft Hotel - Rooftop",
  reception: "A continuación, cena y baile.",
  hashtag: "#OlgaAndMiguel",
  story:
    "Dos caminos, un mismo viaje. Tras casi dos años maravillosos, nos llena de alegría invitar a las personas que más queremos a ser testigos del comienzo de nuestro «para siempre».",
  rsvpDeadline: "El Primero de Agosto, 2026",
  rsvpBy: "Julio 22, 2026",
  carousel: [
    { src: "/wedding/couple-1.png", alt: "The couple sitting down together while having a good time" },
    { src: "/wedding/couple-2.png", alt: "The couple inclined posing while doing eye to ey contact" },
    { src: "/wedding/venue.png", alt: "An elegant candlelit reception table setting at dusk" },
    { src: "/wedding/florals.png", alt: "A wedding bouquet of white roses, white cartuchos and green eucalyptus" },
  ],
  heroImage: "/wedding/hero.png",
}

export type RsvpStatus = "pending" | "attending" | "declined"

export type Guest = {
  id: string
  admin_id: string
  slug: string
  name: string
  phone: string
  max_guests: number
  rsvp_status: RsvpStatus
  guest_count: number
  guest_names: string[]
  message: string | null
  responded_at: string | null
  created_at: string
}
