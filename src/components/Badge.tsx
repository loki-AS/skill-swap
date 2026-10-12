import type { ReactNode } from 'react'

type Tone = 'neutral' | 'teach' | 'learn' | 'mutual' | 'info' | 'success' | 'warning'

export function Badge({ tone = 'neutral', children }: { tone?: Tone; children: ReactNode }) {
  return <span className={`badge badge--${tone}`}>{children}</span>
}

/** Small numeric count, e.g. unread messages. */
export function CountBadge({ count, label }: { count: number; label: string }) {
  if (count <= 0) return null
  return (
    <span className="count-badge" aria-label={`${count} ${label}`}>
      {count > 99 ? '99+' : count}
    </span>
  )
}
