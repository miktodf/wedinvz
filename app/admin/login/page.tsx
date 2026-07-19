"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Ornament } from "@/components/ornament"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { wedding } from "@/lib/wedding"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      router.push("/admin")
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="flex min-h-svh w-full items-center justify-center bg-primary p-6 text-primary-foreground">
      <div className="w-full max-w-md animate-fade-up">
        <div className="mb-8 text-center">
          <p className="font-sans text-xs uppercase tracking-luxe text-gold">{wedding.coupleNames}</p>
          <h1 className="mt-3 font-heading text-4xl text-balance">Admin Access</h1>
          <Ornament className="mt-5" />
        </div>

        <div className="rounded-xl border border-gold/25 bg-card/5 p-8 backdrop-blur">
          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-primary-foreground/80">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-gold/30 bg-background/10 text-primary-foreground placeholder:text-primary-foreground/40"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password" className="text-primary-foreground/80">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-gold/30 bg-background/10 text-primary-foreground placeholder:text-primary-foreground/40"
              />
            </div>
            {error && <p className="text-sm text-destructive-foreground/90 bg-destructive/30 rounded px-3 py-2">{error}</p>}
            <Button
              type="submit"
              disabled={isLoading}
              className="mt-2 bg-gold text-gold-foreground hover:bg-gold/90"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-primary-foreground/60">
            Need an admin account?{" "}
            <Link href="/admin/sign-up" className="text-gold underline-offset-4 hover:underline">
              Create one
            </Link>
          </p>
        </div>

        <p className="mt-8 text-center text-sm">
          <Link href="/" className="text-primary-foreground/50 hover:text-gold">
            &larr; Back to home
          </Link>
        </p>
      </div>
    </main>
  )
}
