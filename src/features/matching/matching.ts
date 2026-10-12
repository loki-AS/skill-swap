import type { Match, MatchKind, MatchedSkills, User } from '../../types'
import { normalizeSkill } from '../skills/skills'

/** Items of `source` that also appear in `target` (normalized), deduplicated, keeping `source` casing. */
function intersectSkills(source: readonly string[], target: readonly string[]): string[] {
  const targetKeys = new Set(target.map(normalizeSkill))
  const seen = new Set<string>()
  return source.filter((skill) => {
    const key = normalizeSkill(skill)
    if (!targetKeys.has(key) || seen.has(key)) return false
    seen.add(key)
    return true
  })
}

export function getMatchedSkills(currentUser: User, otherUser: User): MatchedSkills {
  return {
    youTeach: intersectSkills(currentUser.teaches, otherUser.learns),
    theyTeach: intersectSkills(otherUser.teaches, currentUser.learns),
  }
}

/** Reciprocal rule: A.teaches ∩ B.learns ≠ ∅ AND B.teaches ∩ A.learns ≠ ∅. */
export function getMatchKind({ youTeach, theyTeach }: MatchedSkills): MatchKind {
  if (youTeach.length > 0 && theyTeach.length > 0) return 'mutual'
  if (theyTeach.length > 0) return 'they-teach'
  if (youTeach.length > 0) return 'you-teach'
  return 'none'
}

/**
 * 0–100. Coverage = share of each side's learning list the other can fill.
 * Mutual matches land in 60–100, one-way in 20–50, no overlap is 0.
 */
export function calculateCompatibility(currentUser: User, otherUser: User): number {
  const skills = getMatchedSkills(currentUser, otherUser)
  const kind = getMatchKind(skills)
  if (kind === 'none') return 0
  const theirCoverage = skills.youTeach.length / Math.max(otherUser.learns.length, 1)
  const yourCoverage = skills.theyTeach.length / Math.max(currentUser.learns.length, 1)
  const coverage = (theirCoverage + yourCoverage) / 2
  return kind === 'mutual' ? 60 + Math.round(40 * coverage) : 20 + Math.round(60 * coverage)
}

export function getMatch(currentUser: User, otherUser: User): Match {
  const skills = getMatchedSkills(currentUser, otherUser)
  return { user: otherUser, skills, kind: getMatchKind(skills), score: calculateCompatibility(currentUser, otherUser) }
}

const byScoreThenName = (a: Match, b: Match) => b.score - a.score || a.user.name.localeCompare(b.user.name)

export function getAllMatches(currentUser: User, users: readonly User[]): Match[] {
  return users
    .filter((u) => u.id !== currentUser.id)
    .map((u) => getMatch(currentUser, u))
    .sort(byScoreThenName)
}

export function findMutualMatches(currentUser: User, users: readonly User[]): Match[] {
  return getAllMatches(currentUser, users).filter((m) => m.kind === 'mutual')
}

/** One-way relevance: only one side of the swap is satisfied. */
export const isOneWay = (match: Match) => match.kind === 'they-teach' || match.kind === 'you-teach'

export function findRelevantMatches(currentUser: User, users: readonly User[]): Match[] {
  return getAllMatches(currentUser, users).filter(isOneWay)
}
