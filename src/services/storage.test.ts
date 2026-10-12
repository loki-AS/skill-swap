import { isArrayOf, isConversation, isUser } from './guards'
import { loadAppData, saveProfile } from './repository'
import { purgeStaleVersions, readItem, STORAGE_VERSION, writeItem } from './storage'

const KEY = `skillswap:v${STORAGE_VERSION}:`
const profile = {
  id: 'me',
  name: 'Test',
  avatar: '',
  headline: '',
  bio: '',
  location: 'Pune',
  availability: 'Flexible' as const,
  teaches: ['C'],
  learns: ['Canva'],
}

beforeEach(() => localStorage.clear())

describe('storage', () => {
  it('saves and loads a value', () => {
    expect(writeItem('profile', profile)).toBe(true)
    expect(readItem('profile', isUser)).toEqual({ status: 'ok', value: profile })
  })

  it('reports missing data', () => {
    expect(readItem('profile', isUser)).toEqual({ status: 'missing', value: null })
  })

  it('rejects and removes corrupted JSON', () => {
    localStorage.setItem(`${KEY}profile`, '{not json')
    expect(readItem('profile', isUser).status).toBe('invalid')
    expect(localStorage.getItem(`${KEY}profile`)).toBeNull()
  })

  it('rejects valid JSON with the wrong shape', () => {
    localStorage.setItem(`${KEY}conversations`, JSON.stringify([{ id: 1 }]))
    expect(readItem('conversations', isArrayOf(isConversation)).status).toBe('invalid')
  })

  it('purges keys from older schema versions', () => {
    localStorage.setItem('skillswap:v0:profile', '{}')
    localStorage.setItem('unrelated', 'keep')
    purgeStaleVersions()
    expect(localStorage.getItem('skillswap:v0:profile')).toBeNull()
    expect(localStorage.getItem('unrelated')).toBe('keep')
  })
})

describe('repository', () => {
  it('seeds demo conversations on first launch', async () => {
    const { data, recovered } = await loadAppData()
    expect(data.profile).toBeNull()
    expect(data.conversations.length).toBeGreaterThan(0)
    expect(recovered).toBe(false)
  })

  it('round-trips the profile across loads', async () => {
    await saveProfile(profile)
    expect((await loadAppData()).data.profile).toEqual(profile)
  })

  it('flags recovery when stored data is invalid', async () => {
    localStorage.setItem(`${KEY}preferences`, '"broken"')
    const { data, recovered } = await loadAppData()
    expect(recovered).toBe(true)
    expect(data.preferences.theme).toBe('system')
  })
})
