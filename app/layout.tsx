import { Analytics } from "@vercel/analytics/next"
import type { Metadata, Viewport } from "next"
import { Cormorant_Garamond, Jost, Geist_Mono } from "next/font/google"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Olga & Miguel — Estás invitado!",
  description:
    "Acompáñanos a celebrar nuestra boda. Busca tu invitación personalizada y confírmanos si podrás compartir este día tan especial con nosotros.",
  generator: "v0.app",
  openGraph: {
    title: "Olga & Miguel — Estás invitado!",
    description: "Acompáñenos a celebrar nuestra boda. Por favor, confirme su asistencia respondiendo a su invitación personalizada.",
    type: "website",
  },
}

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#163832",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable} ${geistMono.variable} bg-background`}>
      <body className="font-sans antialiased">
        {children}
        <Toaster position="top-center" />
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}
