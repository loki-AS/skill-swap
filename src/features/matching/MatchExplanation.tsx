import { Icon } from '../../components/Icon'
import { SkillTag } from '../../components/SkillTag'
import type { Match } from '../../types'
import { firstName } from '../../utils/format'
import { MATCH_LABELS } from './labels'

interface LaneProps {
  direction: 'give' | 'get'
  fromLabel: string
  toLabel: string
  skills: string[]
  emptyText: string
}

function Lane({ direction, fromLabel, toLabel, skills, emptyText }: LaneProps) {
  const tone = direction === 'give' ? 'teach' : 'learn'
  return (
    <div className={`lane lane--${direction}${skills.length ? '' : ' lane--empty'}`}>
      <span className="lane__label">{fromLabel}</span>
      <div className="lane__track">
        {skills.length ? (
          <ul className="skill-list" aria-label={`${fromLabel}, ${toLabel}`}>
            {skills.map((s) => (
              <li key={s}>
                <SkillTag skill={s} tone={tone} />
              </li>
            ))}
          </ul>
        ) : (
          <span className="lane__empty">{emptyText}</span>
        )}
        <Icon name="arrowRight" size={18} className="lane__arrow" />
      </div>
      <span className="lane__label lane__label--end">{toLabel}</span>
    </div>
  )
}

/** The core visual: why two people match, lane by lane. */
export function MatchExplanation({ match, compact }: { match: Match; compact?: boolean }) {
  const name = firstName(match.user.name)
  const { youTeach, theyTeach } = match.skills
  return (
    <div className={`match-explainer match-explainer--${match.kind}${compact ? ' match-explainer--compact' : ''}`}>
      <Lane
        direction="give"
        fromLabel="You teach"
        toLabel={`${name} wants`}
        skills={youTeach}
        emptyText={`Nothing ${name} wants yet`}
      />
      <span className="match-explainer__swap" aria-hidden="true">
        <Icon name="swap" size={16} />
      </span>
      <Lane
        direction="get"
        fromLabel={`${name} teaches`}
        toLabel="You want"
        skills={theyTeach}
        emptyText="Nothing on your learning list"
      />
      <p className="match-explainer__verdict">
        <Icon name={match.kind === 'mutual' ? 'check' : 'sparkle'} size={16} />
        {match.kind === 'mutual' ? 'Perfect Skill Swap' : MATCH_LABELS[match.kind]}
      </p>
    </div>
  )
}
