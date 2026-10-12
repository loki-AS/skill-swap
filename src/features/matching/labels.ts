import type { MatchKind } from '../../types'

export const MATCH_LABELS: Record<MatchKind, string> = {
  mutual: 'Mutual skill match',
  'they-teach': 'They can teach you',
  'you-teach': 'You can teach them',
  none: 'No overlap yet',
}
