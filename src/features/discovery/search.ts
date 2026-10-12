import type { Match } from '../../types'
import { isOneWay } from '../matching/matching'
import { getSkillCategory, includesSkill, normalizeSkill } from '../skills/skills'

export const MATCH_FILTERS = ['all', 'mutual', 'relevant'] as const
export type MatchFilter = (typeof MATCH_FILTERS)[number]

export interface SearchFilters {
  /** Free text: name, location, headline or any skill. */
  query: string
  /** A skill the person can teach. Empty = any. */
  skill: string
  location: string
  category: string
  matchType: MatchFilter
}

export const EMPTY_FILTERS: SearchFilters = { query: '', skill: '', location: '', category: '', matchType: 'all' }

function matchesQuery(match: Match, query: string): boolean {
  const q = normalizeSkill(query)
  if (!q) return true
  const { name, location, headline, teaches, learns } = match.user
  return [name, location, headline, ...teaches, ...learns].some((field) => normalizeSkill(field).includes(q))
}

function matchesType(match: Match, type: MatchFilter): boolean {
  if (type === 'mutual') return match.kind === 'mutual'
  if (type === 'relevant') return isOneWay(match)
  return true
}

export function filterMatches(matches: readonly Match[], filters: SearchFilters): Match[] {
  return matches.filter(
    (m) =>
      matchesQuery(m, filters.query) &&
      (!filters.skill || includesSkill(m.user.teaches, filters.skill)) &&
      (!filters.location || normalizeSkill(m.user.location) === normalizeSkill(filters.location)) &&
      (!filters.category || m.user.teaches.some((s) => getSkillCategory(s) === filters.category)) &&
      matchesType(m, filters.matchType),
  )
}

export function hasActiveFilters(filters: SearchFilters): boolean {
  return Boolean(filters.query || filters.skill || filters.location || filters.category || filters.matchType !== 'all')
}
