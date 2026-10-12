import type { Match } from '../../types'
import { firstName } from '../../utils/format'

const list = (skills: string[]) =>
  skills.length <= 1 ? (skills[0] ?? '') : `${skills.slice(0, -1).join(', ')} and ${skills.at(-1)}`

/** A friendly opener that names the actual swap, so the first message is never a blank page. */
export function suggestIntro({ user, skills, kind }: Match): string {
  const name = firstName(user.name)
  const give = list(skills.youTeach)
  const get = list(skills.theyTeach)
  switch (kind) {
    case 'mutual':
      return `Hi ${name}! Looks like a perfect swap — I can teach you ${give}, and I’d love to learn ${get} from you. Want to set up a first session?`
    case 'they-teach':
      return `Hi ${name}! I’ve been wanting to learn ${get}. Is there anything I could help you with in return?`
    case 'you-teach':
      return `Hi ${name}! I saw you want to learn ${give} — I’d be happy to help. What are you hoping to work on?`
    default:
      return `Hi ${name}! Your profile caught my eye — would you be up for a skill swap?`
  }
}
