import { DEMO_USERS, SAMPLE_PROFILE } from '../../data/users'
import { getAllMatches } from '../matching/matching'
import { EMPTY_FILTERS, filterMatches, type SearchFilters } from './search'

const me = { ...SAMPLE_PROFILE, id: 'me', avatar: '' }
const matches = getAllMatches(me, DEMO_USERS)
const search = (filters: Partial<SearchFilters>) => filterMatches(matches, { ...EMPTY_FILTERS, ...filters }).map((m) => m.user.name)

describe('discovery search', () => {
  it('returns everyone with no filters', () => {
    expect(search({})).toHaveLength(DEMO_USERS.length)
  })

  it('searches by name, case-insensitively', () => {
    expect(search({ query: 'ananya' })).toEqual(['Ananya Rao'])
  })

  it('free-text query matches skills', () => {
    const names = search({ query: 'JavaScript' })
    expect(names).toEqual(expect.arrayContaining(['Rohan Mehta', 'Vikram Joshi']))
    expect(names).not.toContain('Tanvi Shah')
  })

  it('filters by location', () => {
    const names = search({ location: 'Pune' })
    expect(names.length).toBeGreaterThan(0)
    expect(DEMO_USERS.filter((u) => names.includes(u.name)).every((u) => u.location === 'Pune')).toBe(true)
  })

  it('combines skill and location (spec: Canva in Bengaluru)', () => {
    expect(search({ skill: 'canva', location: 'Bengaluru' })).toEqual(['Ananya Rao'])
  })

  it('filters by match type', () => {
    expect(search({ matchType: 'mutual' })).toEqual(expect.arrayContaining(['Liam Fernandes', 'Ananya Rao']))
    expect(search({ matchType: 'mutual' })).not.toContain('Kabir Singh')
    expect(search({ matchType: 'relevant' })).toContain('Kabir Singh')
  })

  it('returns an empty list when nothing matches', () => {
    expect(search({ query: 'underwater basket weaving' })).toEqual([])
    expect(search({ skill: 'Guitar', location: 'Kolkata' })).toEqual([])
  })
})
