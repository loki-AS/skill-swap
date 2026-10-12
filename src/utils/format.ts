export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  const first = parts[0]?.[0] ?? '?'
  const last = parts.length > 1 ? (parts.at(-1)?.[0] ?? '') : ''
  return (first + last).toUpperCase()
}

/** Stable 0–359 hue from a string, so a person's avatar colour never changes. */
export function hueFromString(value: string): number {
  let hash = 0
  for (const char of value) hash = (hash * 31 + char.charCodeAt(0)) % 360
  return hash
}

const timeFmt = new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' })
const dayFmt = new Intl.DateTimeFormat(undefined, { weekday: 'short' })
const dateFmt = new Intl.DateTimeFormat(undefined, { day: 'numeric', month: 'short' })
const longDayFmt = new Intl.DateTimeFormat(undefined, { weekday: 'long', day: 'numeric', month: 'long' })

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
const daysAgo = (iso: string, now: Date) => Math.round((startOfDay(now) - startOfDay(new Date(iso))) / 86_400_000)

export const formatTime = (iso: string) => timeFmt.format(new Date(iso))

/** Conversation-list style: "4:32 PM", "Yesterday", "Mon", "12 Mar". */
export function formatShortDate(iso: string, now = new Date()): string {
  const days = daysAgo(iso, now)
  if (days === 0) return formatTime(iso)
  if (days === 1) return 'Yesterday'
  if (days < 7) return dayFmt.format(new Date(iso))
  return dateFmt.format(new Date(iso))
}

/** Day separator inside a chat: "Today", "Yesterday", "Monday, 3 March". */
export function formatDayHeading(iso: string, now = new Date()): string {
  const days = daysAgo(iso, now)
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  return longDayFmt.format(new Date(iso))
}

export const firstName = (name: string) => name.trim().split(/\s+/)[0] ?? name

export const pluralize = (count: number, word: string) => `${count} ${word}${count === 1 ? '' : 's'}`
