import { includesSkill } from '../features/skills/skills'
import { Icon } from './Icon'

export type SkillTone = 'teach' | 'learn' | 'neutral'

interface SkillTagProps {
  skill: string
  tone?: SkillTone
  /** Marks a skill that's part of a match with the current user. */
  matched?: boolean
  onRemove?: () => void
}

export function SkillTag({ skill, tone = 'neutral', matched, onRemove }: SkillTagProps) {
  return (
    <span className={`skill-tag skill-tag--${tone}${matched ? ' skill-tag--matched' : ''}`}>
      {matched && <Icon name="swap" size={13} />}
      {skill}
      {matched && <span className="sr-only"> (matches you)</span>}
      {onRemove && (
        <button type="button" className="skill-tag__remove" onClick={onRemove} aria-label={`Remove ${skill}`}>
          <Icon name="close" size={12} />
        </button>
      )}
    </span>
  )
}

interface SkillListProps {
  skills: readonly string[]
  tone: SkillTone
  /** Skills to highlight as matched (normalized comparison). */
  highlight?: readonly string[]
  limit?: number
  emptyText?: string
  /** Neutral chips, with only matched skills coloured. For dense cards. */
  quiet?: boolean
}

export function SkillList({ skills, tone, highlight = [], limit, emptyText = 'None yet', quiet }: SkillListProps) {
  if (skills.length === 0) return <p className="muted small">{emptyText}</p>
  const isMatched = (s: string) => includesSkill(highlight, s)
  // Matched skills first so they survive truncation.
  const ordered = [...skills].sort((a, b) => Number(isMatched(b)) - Number(isMatched(a)))
  const shown = limit ? ordered.slice(0, limit) : ordered
  const hidden = ordered.length - shown.length
  return (
    <ul className="skill-list">
      {shown.map((s) => (
        <li key={s}>
          <SkillTag skill={s} tone={quiet && !isMatched(s) ? 'neutral' : tone} matched={isMatched(s)} />
        </li>
      ))}
      {hidden > 0 && (
        <li>
          <span className="skill-tag skill-tag--more">+{hidden}</span>
        </li>
      )}
    </ul>
  )
}
