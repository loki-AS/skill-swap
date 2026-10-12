import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { Avatar } from '../../components/Avatar'
import { Button, ButtonLink } from '../../components/Button'
import { Icon } from '../../components/Icon'
import type { Match } from '../../types'
import { MatchExplanation } from './MatchExplanation'
import { MatchScore } from './MatchScore'

interface MatchCardProps {
  match: Match
  onConnect: (match: Match) => void
  hasConversation: boolean
  index?: number
}

/** Wide card for the Matches page: profile preview on the left, the reciprocal explanation on the right. */
export function MatchCard({ match, onConnect, hasConversation, index = 0 }: MatchCardProps) {
  const { user, kind } = match
  return (
    <article
      className={`card match-card match-card--${kind}`}
      style={{ '--i': Math.min(index, 12) } as CSSProperties}
      aria-labelledby={`match-${user.id}`}
    >
      <div className="match-card__person">
        <Avatar name={user.name} src={user.avatar} size="lg" />
        <div className="min-w-0">
          <h3 id={`match-${user.id}`} className="match-card__name">
            <Link to={`/people/${user.id}`}>{user.name}</Link>
          </h3>
          <p className="muted small">{user.headline}</p>
          <p className="profile-card__meta">
            <Icon name="pin" size={14} /> {user.location} · <Icon name="clock" size={14} /> {user.availability}
          </p>
        </div>
        <MatchScore match={match} size="lg" />
      </div>
      <MatchExplanation match={match} />
      <footer className="match-card__actions">
        <ButtonLink to={`/people/${user.id}`} variant="ghost" size="sm">
          Profile
        </ButtonLink>
        <Button size="sm" variant={kind === 'mutual' ? 'swap' : 'primary'} icon="message" onClick={() => onConnect(match)}>
          {hasConversation ? 'Message' : 'Start swap'}
          <span className="sr-only"> with {user.name}</span>
        </Button>
      </footer>
    </article>
  )
}
