"use client"
import Image from "next/image"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Monogram, Ornament } from "@/components/ornament"
import { Carousel } from "@/components/carousel"
import { wedding } from "@/lib/wedding"
import { verifyPhone, submitRsvp } from "@/app/invite/[slug]/actions"
import { Check, X, Minus, Plus, Loader2, PartyPopper, CalendarDays, MapPin, Clock, Calendar, Heart } from "lucide-react"

type Guest = {
  slug: string
  name: string
  max_guests: number
  rsvp_status: "pending" | "attending" | "declined"
  guest_count: number
  guest_names: string[]
  message: string | null
}

type Step = "invite" | "verify" | "rsvp" | "done"

export function Invitation({ guest }: { guest: Guest }) {
  const alreadyResponded = guest.rsvp_status !== "pending"
  const [step, setStep] = useState<Step>("invite")
  const [phone, setPhone] = useState("")
  const [verifying, setVerifying] = useState(false)
  const [verifyError, setVerifyError] = useState("")

  const [status, setStatus] = useState<"attending" | "declined">("attending")
  const [count, setCount] = useState(Math.max(1, guest.guest_count || 1))
  const [names, setNames] = useState<string[]>(guest.guest_names ?? [])
  const [message, setMessage] = useState(guest.message ?? "")
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [finalStatus, setFinalStatus] = useState<"attending" | "declined">(
    guest.rsvp_status === "declined" ? "declined" : "attending",
  )

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault()
    setVerifying(true)
    setVerifyError("")
    const res = await verifyPhone(guest.slug, phone)
    setVerifying(false)
    if (res.ok) {
      setStep("rsvp")
    } else {
      setVerifyError(res.error)
    }
  }

  function setName(i: number, value: string) {
    setNames((prev) => {
      const next = [...prev]
      next[i] = value
      return next
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setSubmitError("")
    const res = await submitRsvp({
      slug: guest.slug,
      phone,
      status,
      guestCount: count,
      guestNames: status === "attending" ? names.slice(0, count) : [],
      message,
    })
    console.log(res + "invitation")
    setSubmitting(false)
    if (res.ok) {
      setFinalStatus(status)
      setStep("done")
    } else {
      setSubmitError(res.error)
    }
  }

  return (
    <div className="relative min-h-dvh overflow-hidden bg-background">
      {/* Hero */}
      <section className="relative isolate flex min-h-dvh flex-col items-center justify-center overflow-hidden px-4 py-16 text-center">
        {/* Capa 1: imagen de fondo */}
        <div className="absolute inset-0 z-0">
          <img
            src="/wedding/hero.png"
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Capa 2: filtros sobre la imagen */}
        <div className="absolute inset-0 z-0 bg-primary/50" />

        <div className="absolute inset-0 z-0 bg-gradient-to-b from-primary/20 via-primary/45 to-primary/85" />

        {/* Capa 3: contenido */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative z-10 flex flex-col items-center gap-6 text-primary-foreground"
        >
          <p className="animate-fade-up font-sans text-xs uppercase tracking-luxe text-gold delay-100">
            Together with their families
          </p>

          <Ornament className="text-secondary" />

          <h1 className="font-serif text-5xl leading-tight text-balance sm:text-7xl">
            {wedding.partnerA}

            <span className="mx-3 text-gold">&amp;</span>

            {wedding.partnerB}
          </h1>

          <p className="max-w-md text-pretty text-base leading-relaxed text-primary-foreground/85">
            tienen el placer de invitarles a celebrar su boda...
          </p>

          <div className="mt-2 flex flex-col items-center gap-1">
            <p className="font-serif text-2xl text-secondary">
              {wedding.dateLong}
            </p>

            <p className="text-sm tracking-wide text-primary-foreground/80">
              {wedding.venue}
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mt-6 rounded-full border border-secondary/40 bg-black/15 px-6 py-2 backdrop-blur-sm"
          >
            <p className="text-sm text-primary-foreground">
              Querido/a{" "}
              <span className="font-medium text-secondary">
                {guest.name}
              </span>
              , estás invitado/a!
            </p>
          </motion.div>

          <Button
            size="lg"
            onClick={() => {
              const el = document.getElementById("rsvp")
              el?.scrollIntoView({ behavior: "smooth" })
            }}
            className="mt-4 bg-secondary text-secondary-foreground hover:bg-secondary/90"
          >
            {alreadyResponded ? "Mira / Actualiza RSVP" : "Confirma tu asistencia ahora"}
          </Button>
        </motion.div>

        {/* Indicador inferior */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 1 }}
          className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-xs uppercase tracking-widest text-primary-foreground/60"
        >
          Scroll
        </motion.div>
      </section>

      {/* Story */}
      <section id="details" className="mx-auto max-w-3xl px-6 py-24 text-center">
        <Monogram className="mx-auto" />
        <Ornament className="mt-8" label="Nuestra Historia" />
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
          <h2 className="mt-6 font-heading text-5xl text-balance">¿Cuándo &amp; Dónde?</h2>
          <div className="mt-14 grid gap-8 sm:grid-cols-3">
            {[
              { icon: Calendar, title: "La Fecha", lines: [wedding.date, wedding.time] },
              { icon: MapPin, title: "El Lugar", lines: [wedding.ceremonyVenue, wedding.ceremonyAddress] },
              { icon: Heart, title: "Recepción", lines: [wedding.reception, wedding.hashtag] },
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

      {/* RSVP */}
      <section id="rsvp" className="mx-auto w-full max-w-xl scroll-mt-8 px-4 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
        >
          <Card className="overflow-hidden">
            <div className="flex flex-col items-center gap-2 border-b border-border bg-primary px-6 py-8 text-center text-primary-foreground">
              <Ornament className="text-secondary" />
              <h2 className="font-serif text-3xl">Confirmar asistencia </h2>
              <p className="text-sm text-primary-foreground/80">Por favor, responda antes del {wedding.rsvpBy}</p>
            </div>

            <div className="p-6 sm:p-8">
              <AnimatePresence mode="wait">
                {/* Verify gate */}
                {step !== "done" && (
                  <motion.div key="gate">
                    {alreadyResponded && step === "invite" && (
                      <div className="mb-6 rounded-lg border border-primary/20 bg-accent/40 p-4 text-center text-sm text-foreground">
                        You previously responded{" "}
                        <span className="font-medium">
                          {guest.rsvp_status === "attending" ? "Attending" : "Can't make it"}
                        </span>
                        . You can update your response below.
                      </div>
                    )}

                    {step !== "rsvp" ? (
                      <form onSubmit={handleVerify} className="flex flex-col gap-4">
                        <div className="text-center">
                          <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
                            Para mantener la privacidad, por favor confirme su identidad con el número de teléfono en el que
                            recibió esta invitación.
                          </p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Label htmlFor="phone">Número de Teléfono</Label>
                          <Input
                            id="phone"
                            type="tel"
                            inputMode="tel"
                            autoComplete="tel"
                            placeholder="ej. +504 1234 5678"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                          />
                          {verifyError && <p className="text-sm text-destructive">{verifyError}</p>}
                        </div>
                        <Button type="submit" disabled={verifying} className="w-full">
                          {verifying ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" /> Verifying…
                            </>
                          ) : (
                            "Verificar y continuar"
                          )}
                        </Button>
                      </form>
                    ) : (
                      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        {/* Attendance toggle */}
                        <div className="flex flex-col gap-2">
                          <Label>¿Te unirás a nosotros?</Label>
                          <div className="grid grid-cols-2 gap-3">
                            <button
                              type="button"
                              onClick={() => setStatus("attending")}
                              className={`flex items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm transition-colors ${
                                status === "attending"
                                  ? "border-primary bg-primary text-primary-foreground"
                                  : "border-border bg-background text-foreground hover:border-primary/40"
                              }`}
                            >
                              <Check className="h-4 w-4" aria-hidden /> Acepto con alegría
                            </button>
                            <button
                              type="button"
                              onClick={() => setStatus("declined")}
                              className={`flex items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm transition-colors ${
                                status === "declined"
                                  ? "border-primary bg-primary text-primary-foreground"
                                  : "border-border bg-background text-foreground hover:border-primary/40"
                              }`}
                            >
                              <X className="h-4 w-4" aria-hidden /> Lamento declinar
                            </button>
                          </div>
                        </div>

                        <AnimatePresence>
                          {status === "attending" && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="flex flex-col gap-6 overflow-hidden"
                            >
                              {/* Guest count */}
                              <div className="flex flex-col gap-2">
                                <Label>Número de invitados (incluyéndote a ti)</Label>
                                <div className="flex items-center gap-4">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setCount((c) => Math.max(1, c - 1))}
                                    disabled={count <= 1}
                                    aria-label="Decrease guests"
                                  >
                                    <Minus className="h-4 w-4" />
                                  </Button>
                                  <span className="min-w-10 text-center font-serif text-3xl text-foreground">
                                    {count}
                                  </span>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setCount((c) => Math.min(guest.max_guests, c + 1))}
                                    disabled={count >= guest.max_guests}
                                    aria-label="Increase guests"
                                  >
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                  <span className="text-sm text-muted-foreground">
                                    de {guest.max_guests} reservado
                                  </span>
                                </div>
                              </div>

                              {/* Optional names */}
                              <div className="flex flex-col gap-2">
                                <Label>
                                  Nombres de los invitados <span className="text-muted-foreground">(opcional)</span>
                                </Label>
                                <div className="flex flex-col gap-2">
                                  <Input
                                    value={guest.name}
                                    readOnly
                                    aria-label="Primary guest"
                                    className="bg-muted"
                                  />

                                  {Array.from({ length: Math.max(0, count - 1) }).map((_, i) => (
                                    <Input
                                      key={i}
                                      placeholder={`Guest ${i + 2}`}
                                      value={names[i] ?? ""}
                                      onChange={(e) => setName(i, e.target.value)}
                                    />
                                  ))}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Message */}
                        <div className="flex flex-col gap-2">
                          <Label htmlFor="message">
                            Una nota para la pareja <span className="text-muted-foreground">(opcional)</span>
                          </Label>
                          <Textarea
                            id="message"
                            placeholder="Comparte tus mejores deseos…"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows={3}
                          />
                        </div>

                        {submitError && <p className="text-sm text-destructive">{submitError}</p>}

                        <Button type="submit" disabled={submitting} className="w-full" size="lg">
                          {submitting ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" /> Enviando…
                            </>
                          ) : (
                            "Enviar Respuesta"
                          )}
                        </Button>
                      </form>
                    )}
                  </motion.div>
                )}

                {/* Confirmation */}
                {step === "done" && (
                  <motion.div
                    key="done"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center gap-4 py-6 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 12 }}
                      className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground"
                    >
                      {finalStatus === "attending" ? (
                        <PartyPopper className="h-8 w-8" />
                      ) : (
                        <Check className="h-8 w-8" />
                      )}
                    </motion.div>
                    <h3 className="font-serif text-2xl text-foreground">
                      {finalStatus === "attending" ? "We can't wait to celebrate with you!" : "Thank you for letting us know"}
                    </h3>
                    <p className="max-w-sm text-pretty text-sm leading-relaxed text-muted-foreground">
                      {finalStatus === "attending"
                        ? `Tu confirmación de asistencia para ${count} ${count === 1 ? "invitado" : "invitados"} ha sido recibida. Nos vemos el ${wedding.dateShort}.`
                        : "Te echaremos de menos, pero agradecemos tu respuesta. Estarás en nuestros corazones ese día."}
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setStep("rsvp")
                      }}
                      className="mt-2"
                    >
                      Actualizar mi respuesta
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Card>
        </motion.div>

        <p className="mt-8 text-center font-serif text-lg text-primary">
          {wedding.partnerA} &amp; {wedding.partnerB}
        </p>
      </section>
    </div>
  )
}
