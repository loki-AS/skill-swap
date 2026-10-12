import type { ReactNode } from 'react'
import { Icon, type IconName } from './Icon'

interface StateProps {
  icon?: IconName
  title: string
  children?: ReactNode
  action?: ReactNode
}

export function EmptyState({ icon = 'sparkle', title, children, action }: StateProps) {
  return (
    <div className="state">
      <span className="state__icon">
        <Icon name={icon} size={26} />
      </span>
      <h3 className="state__title">{title}</h3>
      {children && <p className="state__text">{children}</p>}
      {action && <div className="state__action">{action}</div>}
    </div>
  )
}

export function ErrorState({ title = 'Something went wrong', children, action }: Partial<StateProps>) {
  return (
    <div className="state state--error" role="alert">
      <span className="state__icon">
        <Icon name="alert" size={26} />
      </span>
      <h3 className="state__title">{title}</h3>
      {children && <p className="state__text">{children}</p>}
      {action && <div className="state__action">{action}</div>}
    </div>
  )
}

export function Skeleton({ width, height = '1rem', round }: { width?: string; height?: string; round?: boolean }) {
  return <span className={`skeleton${round ? ' skeleton--round' : ''}`} style={{ width, height }} aria-hidden="true" />
}

/** Placeholder shaped like a ProfileCard. */
export function ProfileCardSkeleton() {
  return (
    <div className="card profile-card profile-card--skeleton" aria-hidden="true">
      <div className="profile-card__head">
        <Skeleton width="3rem" height="3rem" round />
        <div className="stack-xs grow">
          <Skeleton width="60%" />
          <Skeleton width="40%" height="0.75rem" />
        </div>
      </div>
      <Skeleton height="2.5rem" />
      <Skeleton width="80%" height="1.5rem" />
      <Skeleton width="70%" height="1.5rem" />
    </div>
  )
}

export function LoadingState({ label = 'Loading', cards = 6 }: { label?: string; cards?: number }) {
  return (
    <div className="card-grid" role="status" aria-busy="true">
      <span className="sr-only">{label}…</span>
      {Array.from({ length: cards }, (_, i) => (
        <ProfileCardSkeleton key={i} />
      ))}
    </div>
  )
}
