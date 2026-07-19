import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Carousel } from "@/components/carousel"
import { Ornament, Monogram } from "@/components/ornament"
import { wedding } from "@/lib/wedding"
import { Calendar, MapPin, Heart } from "lucide-react"

export default function HomePage() {
  return (
    <main className="min-h-svh bg-background">
      {/* Hero */}
      <section className="relative flex min-h-svh items-center justify-center overflow-hidden">
        <Image
          src={wedding.heroImage || "/placeholder.svg"}
          alt="The couple beneath a floral arch at sunset"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-primary/65" />
        <div className="relative z-10 mx-auto max-w-2xl px-6 text-center text-primary-foreground">
          <p className="animate-fade-up font-sans text-xs uppercase tracking-luxe text-gold delay-100">
            Together with their families
          </p>
          <h1 className="animate-fade-up mt-6 font-heading text-6xl leading-none text-balance sm:text-7xl md:text-8xl delay-200">
            {wedding.brideName}
            <span className="mx-3 text-gold">&amp;</span>
            {wedding.groomName}
          </h1>
          <Ornament className="animate-fade-up mt-8 delay-300" />
          <p className="animate-fade-up mt-8 font-heading text-2xl text-primary-foreground/90 delay-500">
            {wedding.shortDate}
          </p>
          <p className="animate-fade-up mt-2 text-sm text-primary-foreground/70 delay-500">{wedding.ceremonyVenue}</p>
          <div className="animate-fade-up mt-10 flex flex-col items-center justify-center gap-3 delay-700 sm:flex-row">
            <Button size="lg" className="bg-gold text-gold-foreground hover:bg-gold/90">
              <Link href="#details">View the details</Link>
            </Button>
          </div>
        </div>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-fade-in text-primary-foreground/60 delay-700">
          <span className="font-sans text-[10px] uppercase tracking-luxe">Scroll</span>
        </div>
      </section>

      {/* Story */}
      <section id="details" className="mx-auto max-w-3xl px-6 py-24 text-center">
        <Monogram className="mx-auto" />
        <Ornament className="mt-8" label="Our Story" />
        <p className="mt-8 font-heading text-3xl leading-relaxed text-pretty text-foreground sm:text-4xl">
          {wedding.story}
        </p>
      </section>

      {/* Carousel */}
      <section className="mx-auto max-w-5xl px-6 pb-24">
        <Carousel slides={wedding.carousel} className="h-[420px] w-full sm:h-[560px]" />
      </section>

      {/* Details cards */}
      <section className="bg-primary px-6 py-24 text-primary-foreground">
        <div className="mx-auto max-w-4xl text-center">
          <Ornament label="Celebration" />
          <h2 className="mt-6 font-heading text-5xl text-balance">When &amp; Where</h2>
          <div className="mt-14 grid gap-8 sm:grid-cols-3">
            {[
              { icon: Calendar, title: "The Date", lines: [wedding.date, wedding.time] },
              { icon: MapPin, title: "The Venue", lines: [wedding.ceremonyVenue, wedding.ceremonyAddress] },
              { icon: Heart, title: "Reception", lines: [wedding.reception, wedding.hashtag] },
            ].map((item) => (
              <div key={item.title} className="rounded-xl border border-gold/25 bg-background/5 p-8 backdrop-blur">
                <item.icon className="mx-auto h-7 w-7 text-gold" strokeWidth={1.5} />
                <h3 className="mt-4 font-heading text-2xl">{item.title}</h3>
                {item.lines.map((line) => (
                  <p key={line} className="mt-2 text-sm text-primary-foreground/70 text-pretty">
                    {line}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RSVP prompt */}
      <section className="mx-auto max-w-2xl px-6 py-24 text-center">
        <Ornament label="Kindly Respond" />
        <h2 className="mt-6 font-heading text-5xl text-balance">Have your invitation?</h2>
        <p className="mt-5 text-muted-foreground text-pretty leading-relaxed">
          Your personal invitation link was sent to you directly. Open it to confirm your attendance by{" "}
          {wedding.rsvpDeadline}. We cannot wait to celebrate with you.
        </p>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-primary py-10 text-center text-primary-foreground">
        <Monogram className="mx-auto h-12 w-12 text-base" />
        <p className="mt-4 font-heading text-xl">{wedding.coupleNames}</p>
        <p className="mt-1 text-xs uppercase tracking-luxe text-primary-foreground/50">{wedding.shortDate}</p>
        <Link href="/admin/login" className="mt-6 inline-block text-xs text-primary-foreground/40 hover:text-gold">
          Admin
        </Link>
      </footer>
    </main>
  )
}
