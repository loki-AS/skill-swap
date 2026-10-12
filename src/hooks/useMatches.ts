import { useMemo } from 'react'
import { useApp, useProfile } from '../app/AppContext'
import { getAllMatches, isOneWay } from '../features/matching/matching'
import type { Match } from '../types'

export interface MatchSets {
  all: Match[]
  mutual: Match[]
  relevant: Match[]
  byUserId: Map<string, Match>
}

/** Every community member scored against the current profile. Recomputed only when skills change. */
export function useMatches(): MatchSets {
  const profile = useProfile()
  const { users } = useApp()
  return useMemo(() => {
    const all = getAllMatches(profile, users)
    return {
      all,
      mutual: all.filter((m) => m.kind === 'mutual'),
      relevant: all.filter(isOneWay),
      byUserId: new Map(all.map((m) => [m.user.id, m])),
    }
  }, [profile, users])
}
