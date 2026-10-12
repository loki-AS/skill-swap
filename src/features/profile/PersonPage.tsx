import { useParams } from 'react-router-dom'
import { useApp, useProfile } from '../../app/AppContext'
import { Button, ButtonLink } from '../../components/Button'
import { ErrorState } from '../../components/States'
import { Icon } from '../../components/Icon'
import { useToast } from '../../components/toast-context'
import { MAX_SKILLS_PER_LIST } from '../../data/skills'
import { useMatches } from '../../hooks/useMatches'
import { firstName } from '../../utils/format'
import { MatchExplanation } from '../matching/MatchExplanation'
import { MatchScore } from '../matching/MatchScore'
import { useConnect } from '../messaging/useConnect'
import { includesSkill } from '../skills/skills'
import { ProfileHeader, SkillPanels } from './ProfileView'

export function PersonPage() {
  const { userId } = useParams()
  const profile = useProfile()
  const { saveProfile } = useApp()
  const toast = useToast()
  const { byUserId } = useMatches()
  const { connect, hasConversation, modal } = useConnect()
  const match = userId ? byUserId.get(userId) : undefined

  if (!match) {
    return (
      <div className="page">
        <ErrorState title="We couldn’t find that person" action={<ButtonLink to="/">Back to Discover</ButtonLink>}>
          The profile may have been removed, or the link is mistyped.
        </ErrorState>
      </div>
    )
  }

  const { user, kind } = match
  const name = firstName(user.name)
  const canLearnMore = profile.learns.length < MAX_SKILLS_PER_LIST
  // Skills they teach that aren't on either of your lists yet — one click away from a match.
  const suggestions = user.teaches.filter((s) => !includesSkill(profile.learns, s) && !includesSkill(profile.teaches, s))

  const addToLearning = (skill: string) => {
    saveProfile({ ...profile, learns: [...profile.learns, skill] })
    toast(`Added ${skill} to what you want to learn`)
  }

  return (
    <div className="page">
      <ProfileHeader
        user={user}
        aside={<MatchScore match={match} size="lg" />}
        actions={
          <>
            <Button variant={kind === 'mutual' ? 'swap' : 'primary'} icon="message" onClick={() => connect(match)}>
              {hasConversation(user.id) ? `Message ${name}` : kind === 'mutual' ? 'Propose a swap' : `Connect with ${name}`}
            </Button>
            <ButtonLink to="/matches" variant="ghost">
              All matches
            </ButtonLink>
          </>
        }
      />

      <section className={`card why-match why-match--${kind}`} aria-labelledby="why-heading">
        <h2 id="why-heading" className="heading">
          Why you match
        </h2>
        <MatchExplanation match={match} />
        {kind !== 'mutual' && suggestions.length > 0 && canLearnMore && (
          <div className="why-match__suggest">
            <p className="small">
              Want to learn something {name} teaches? Add it to your list{kind === 'you-teach' ? ' to make this a mutual match' : ''}:
            </p>
            <ul className="skill-list">
              {suggestions.map((s) => (
                <li key={s}>
                  <button
                    type="button"
                    className="skill-tag skill-tag--learn skill-tag--add"
                    aria-label={`Add ${s} to skills you want to learn`}
                    onClick={() => addToLearning(s)}
                  >
                    <Icon name="plus" size={13} />
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <SkillPanels
        user={user}
        teachTitle={`${name} can teach`}
        learnTitle={`${name} wants to learn`}
        teachHighlight={match.skills.theyTeach}
        learnHighlight={match.skills.youTeach}
      />
      {modal}
    </div>
  )
}
