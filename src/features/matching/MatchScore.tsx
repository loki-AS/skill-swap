import type { CSSProperties } from 'react'
import type { Match } from '../../types'
import { MATCH_LABELS } from './labels'

/** Compatibility ring. Colour follows the match kind; mutual gets the swap gradient. */
export function MatchScore({ match, size = 'md' }: { match: Match; size?: 'md' | 'lg' }) {
  if (match.kind === 'none') return null
  return (
    <div
      className={`match-score match-score--${match.kind} match-score--${size}`}
      style={{ '--score': match.score } as CSSProperties}
      role="img"
      aria-label={`${match.score}% compatible — ${MATCH_LABELS[match.kind]}`}
    >
      <span className="match-score__value">{match.score}%</span>
    </div>
  )
}
