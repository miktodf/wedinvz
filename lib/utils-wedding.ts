// Shared helpers for slugs and phone normalization.

const ALPHABET = "abcdefghijkmnpqrstuvwxyz23456789"

export function generateSlug(length = 7): string {
  let out = ""
  const bytes = new Uint8Array(length)
  crypto.getRandomValues(bytes)
  for (let i = 0; i < length; i++) {
    out += ALPHABET[bytes[i] % ALPHABET.length]
  }
  return out
}

// Normalize a phone number to digits only (keeps a leading +).
// Used so guests can match regardless of spaces, dashes, or parentheses.
export function normalizePhone(phone: string): string {
  const trimmed = phone.trim()
  const hasPlus = trimmed.startsWith("+")
  const digits = trimmed.replace(/\D/g, "")
  return hasPlus ? `+${digits}` : digits
}

// Compare two phone numbers loosely (last 7+ digits must match).
export function phonesMatch(a: string, b: string): boolean {
  const na = normalizePhone(a).replace(/^\+/, "")
  const nb = normalizePhone(b).replace(/^\+/, "")
  if (!na || !nb) return false
  if (na === nb) return true
  const minLen = Math.min(na.length, nb.length, 10)
  if (minLen < 7) return false
  return na.slice(-minLen) === nb.slice(-minLen)
}

export type ParsedContact = { name: string; phone: string; maxGuests: number }

// Parse pasted text. Each line: "Name, Phone, MaxGuests?"
// Accepts commas or tabs as separators. MaxGuests is optional (defaults to 1).
export function parseContacts(raw: string): { contacts: ParsedContact[]; errors: string[] } {
  const errors: string[] = []
  const contacts: ParsedContact[] = []
  const lines = raw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)

  for (const [i, line] of lines.entries()) {
    const parts = line.split(/[,\t]/).map((p) => p.trim())
    const name = parts[0]
    const phone = parts[1]
    const maxGuests = parts[2] ? Number.parseInt(parts[2], 10) : 1

    if (!name || !phone) {
      errors.push(`Line ${i + 1}: needs at least a name and phone`)
      continue
    }
    if (normalizePhone(phone).replace(/\D/g, "").length < 6) {
      errors.push(`Line ${i + 1}: "${phone}" doesn't look like a valid phone`)
      continue
    }
    contacts.push({
      name,
      phone: normalizePhone(phone),
      maxGuests: Number.isFinite(maxGuests) && maxGuests > 0 ? maxGuests : 1,
    })
  }

  return { contacts, errors }
}
