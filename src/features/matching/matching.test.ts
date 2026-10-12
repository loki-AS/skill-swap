import type { User } from '../../types'
import { calculateCompatibility, findMutualMatches, findRelevantMatches, getMatch, getMatchedSkills } from './matching'

const user = (id: string, teaches: string[], learns: string[]): User => ({
  id,
  name: id,
  avatar: '',
  headline: '',
  bio: '',
  location: 'Bengaluru',
  availability: 'Flexible',
  teaches,
  learns,
})

describe('matching engine', () => {
  const a = user('a', ['C', 'React'], ['Canva'])

  it('detects a mutual match (spec example)', () => {
    const b = user('b', ['Canva', 'Python'], ['C'])
    const match = getMatch(a, b)
    expect(match.kind).toBe('mutual')
    expect(match.skills).toEqual({ youTeach: ['C'], theyTeach: ['Canva'] })
  })

  it('detects one-way matches in both directions', () => {
    expect(getMatch(a, user('b', ['Canva'], ['Guitar'])).kind).toBe('they-teach')
    expect(getMatch(a, user('b', ['Guitar'], ['React'])).kind).toBe('you-teach')
  })

  it('returns none with no overlap', () => {
    const match = getMatch(a, user('b', ['Guitar'], ['Piano']))
    expect(match.kind).toBe('none')
    expect(match.score).toBe(0)
  })

  it('collects multiple matched skills without duplicates', () => {
    const me = user('me', ['C', 'React', 'react'], ['Canva', 'Guitar'])
    const them = user('t', ['Guitar', 'Canva', 'Drums'], ['React', 'C'])
    expect(getMatchedSkills(me, them)).toEqual({ youTeach: ['C', 'React'], theyTeach: ['Guitar', 'Canva'] })
  })

  it('compares skills case-insensitively and ignores extra whitespace', () => {
    const me = user('me', ['JavaScript'], ['  photo   editing '])
    const them = user('t', ['Photo Editing'], ['javascript '])
    expect(getMatch(me, them).kind).toBe('mutual')
  })

  it('scores mutual above one-way, and full coverage at 100', () => {
    const full = user('full', ['Canva'], ['C', 'React'])
    const oneWay = user('one', ['Canva'], ['Guitar'])
    expect(calculateCompatibility(a, full)).toBe(100)
    expect(calculateCompatibility(a, oneWay)).toBeLessThan(60)
    expect(calculateCompatibility(a, oneWay)).toBeGreaterThan(0)
  })

  it('splits mutual and relevant lists, excludes self, sorts by score', () => {
    const users = [
      a,
      user('partial', ['Canva'], ['C', 'Rust', 'Go']),
      user('full', ['Canva'], ['C']),
      user('one', ['Canva'], []),
      user('none', ['Drums'], []),
    ]
    expect(findMutualMatches(a, users).map((m) => m.user.id)).toEqual(['full', 'partial'])
    expect(findRelevantMatches(a, users).map((m) => m.user.id)).toEqual(['one'])
  })
})
