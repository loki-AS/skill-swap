import type { CSSProperties } from 'react'
import { hueFromString, initials } from '../utils/format'

interface AvatarProps {
  name: string
  src?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  /** Decorative avatars sit next to the visible name, so they're hidden from screen readers. */
  decorative?: boolean
}

export function Avatar({ name, src, size = 'md', decorative = true }: AvatarProps) {
  const className = `avatar avatar--${size}`
  if (src) return <img className={className} src={src} alt={decorative ? '' : `Photo of ${name}`} />
  const hue = hueFromString(name)
  return (
    <span
      className={className}
      style={{ '--avatar-hue': hue } as CSSProperties}
      role={decorative ? undefined : 'img'}
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : name}
    >
      {initials(name)}
    </span>
  )
}
