import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { Avatar } from '../../components/Avatar'
import { Button, ButtonLink } from '../../components/Button'
import { Icon } from '../../components/Icon'
import { SkillList } from '../../components/SkillTag'
import type { Match } from '../../types'
import { MATCH_LABELS } from '../matching/labels'
import { MatchScore } from '../matching/MatchScore'

interface ProfileCardProps {
  match: Match
  onConnect: (match: Match) => void
  hasConversation: boolean
  /** Position in the grid, for a staggered entrance. */
  index?: number
}

function SwapSide({ label, skills, tone }: { label: string; skills: string[]; tone: 'teach' | 'learn' }) {
  const [first, ...rest] = skills
  return (
    <div className={`swap-strip__side swap-strip__side--${first ? tone : 'empty'}`}>
      <span className="swap-strip__label">{label}</span>
      <span className="swap-strip__skill">
        {first ?? '—'}
        {rest.length > 0 && <span className="swap-strip__more"> +{rest.length}</span>}
      </span>
    </div>
  )
}

/** The exchange at a glance: what you'd give, what you'd get. */
function SwapStrip({ match }: { match: Match }) {
  if (match.kind === 'none') return null
  return (
    <div className="swap-strip" aria-label={MATCH_LABELS[match.kind]}>
      <SwapSide label="You teach" skills={match.skills.youTeach} tone="teach" />
      <span className="swap-strip__icon" aria-hidden="true">
        <Icon name="swap" size={14} />
      </span>
      <SwapSide label="You learn" skills={match.skills.theyTeach} tone="learn" />
    </div>
  )
}

export function ProfileCard({ match, onConnect, hasConversation, index = 0 }: ProfileCardProps) {
  const { user, skills, kind } = match
  const profileUrl = `/people/${user.id}`
  return (
    <article
      className={`card profile-card${kind === 'mutual' ? ' profile-card--mutual' : ''}`}
      style={{ '--i': Math.min(index, 12) } as CSSProperties}
      aria-labelledby={`card-${user.id}`}
    >
      <header className="profile-card__head">
        <Avatar name={user.name} src={user.avatar} size="md" />
        <div className="grow min-w-0">
          <h3 id={`card-${user.id}`} className="profile-card__name">
            <Link to={profileUrl} className="stretched-link">
              {user.name}
            </Link>
          </h3>
          <p className="profile-card__meta">
            <Icon name="pin" size={14} /> {user.location}
            {kind === 'mutual' && <span className="profile-card__mutual">· Mutual match</span>}
          </p>
        </div>
        <MatchScore match={match} />
      </header>

      <SwapStrip match={match} />
      <p className="profile-card__bio">{user.bio}</p>

      <div className="profile-card__skills">
        <div>
          <h4 className="eyebrow">Teaches</h4>
          <SkillList skills={user.teaches} tone="teach" highlight={skills.theyTeach} limit={3} quiet />
        </div>
        <div>
          <h4 className="eyebrow">Wants to learn</h4>
          <SkillList skills={user.learns} tone="learn" highlight={skills.youTeach} limit={3} quiet />
        </div>
      </div>

      <footer className="profile-card__actions">
        <ButtonLink to={profileUrl} variant="secondary" size="sm">
          View profile
        </ButtonLink>
        <Button size="sm" variant={kind === 'mutual' ? 'swap' : 'primary'} icon="message" onClick={() => onConnect(match)}>
          {hasConversation ? 'Message' : 'Connect'}
          <span className="sr-only"> with {user.name}</span>
        </Button>
      </footer>
    </article>
  )
}
