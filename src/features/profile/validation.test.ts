import { isValid, validateProfile, type ProfileDraft } from './validation'

const draft: ProfileDraft = {
  name: 'Aarav',
  avatar: '',
  headline: '',
  bio: '',
  location: 'Pune',
  availability: 'Flexible',
  teaches: ['C'],
  learns: ['Canva'],
}

describe('profile validation', () => {
  it('accepts a complete profile', () => {
    expect(isValid(validateProfile(draft))).toBe(true)
  })

  it('requires name, location and both skill lists', () => {
    const errors = validateProfile({ ...draft, name: ' ', location: '', teaches: [], learns: [] })
    expect(Object.keys(errors).sort()).toEqual(['learns', 'location', 'name', 'teaches'])
  })

  it('caps bio length', () => {
    expect(validateProfile({ ...draft, bio: 'x'.repeat(281) }).bio).toBeDefined()
  })

  it('rejects a skill on both lists, ignoring case', () => {
    expect(validateProfile({ ...draft, learns: ['c '] }).learns).toMatch(/both lists/)
  })
})
