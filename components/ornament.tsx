import { cn } from "@/lib/utils"

// An elegant ornamental divider with a center motif.
export function Ornament({ className, label }: { className?: string; label?: string }) {
  return (
    <div className={cn("flex items-center justify-center gap-4 text-gold", className)} aria-hidden={!label}>
      <span className="h-px w-12 bg-gradient-to-r from-transparent to-gold/60 sm:w-20" />
      {label ? (
        <span className="font-sans text-xs uppercase tracking-luxe text-muted-foreground">{label}</span>
      ) : (
        <span className="text-base">&#10047;</span>
      )}
      <span className="h-px w-12 bg-gradient-to-l from-transparent to-gold/60 sm:w-20" />
    </div>
  )
}

export function Monogram({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "inline-flex h-16 w-16 items-center justify-center rounded-full border border-gold/50 font-heading text-xl text-gold",
        className,
      )}
    >
      O&nbsp;&amp;&nbsp;M
    </div>
  )
}
