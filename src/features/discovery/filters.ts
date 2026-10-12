import { MATCH_FILTERS, type MatchFilter, type SearchFilters } from './search'

// Filters live in the URL so searches survive refresh, back/forward and can be linked to.
const PARAM: Record<keyof SearchFilters, string> = {
  query: 'q',
  skill: 'skill',
  location: 'location',
  category: 'category',
  matchType: 'match',
}

const isMatchFilter = (v: string | null): v is MatchFilter => MATCH_FILTERS.includes(v as MatchFilter)

export function readFilters(params: URLSearchParams): SearchFilters {
  const match = params.get(PARAM.matchType)
  return {
    query: params.get(PARAM.query) ?? '',
    skill: params.get(PARAM.skill) ?? '',
    location: params.get(PARAM.location) ?? '',
    category: params.get(PARAM.category) ?? '',
    matchType: isMatchFilter(match) ? match : 'all',
  }
}

export function writeFilters(filters: SearchFilters): URLSearchParams {
  const params = new URLSearchParams()
  for (const key of Object.keys(PARAM) as (keyof SearchFilters)[]) {
    const value = filters[key]
    if (value && value !== 'all') params.set(PARAM[key], value)
  }
  return params
}

/** Link to Discover with a free-text search, used by the global header search. */
export const discoverSearchUrl = (query: string) => {
  const q = query.trim()
  return q ? `/?${PARAM.query}=${encodeURIComponent(q)}` : '/'
}
