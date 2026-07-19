"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

type Slide = { src: string; alt: string }

export function Carousel({
  slides,
  className,
  interval = 5000,
  rounded = true,
}: {
  slides: Slide[]
  className?: string
  interval?: number
  rounded?: boolean
}) {
  const [index, setIndex] = useState(0)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)

  const go = useCallback(
    (next: number) => {
      setIndex((next + slides.length) % slides.length)
    },
    [slides.length],
  )

  useEffect(() => {
    timer.current = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length)
    }, interval)
    return () => {
      if (timer.current) clearInterval(timer.current)
    }
  }, [slides.length, interval])

  return (
    <div className={cn("relative overflow-hidden", rounded && "rounded-2xl", className)}>
      {slides.map((slide, i) => (
        <div
          key={slide.src}
          className={cn(
            "absolute inset-0 transition-all duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
            i === index ? "opacity-100 scale-100" : "opacity-0 scale-105",
          )}
          aria-hidden={i !== index}
        >
          <Image
            src={slide.src || "/placeholder.svg"}
            alt={slide.alt}
            fill
            priority={i === 0}
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent" />
        </div>
      ))}

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => go(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={cn(
              "h-2 rounded-full transition-all duration-500",
              i === index ? "w-8 bg-gold" : "w-2 bg-background/70 hover:bg-background",
            )}
          />
        ))}
      </div>
    </div>
  )
}
