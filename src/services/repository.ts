import { createSeedConversations, DEMO_USERS } from '../data/users'
import type { Conversation, Preferences, User } from '../types'
import { isArrayOf, isConversation, isPreferences, isUser } from './guards'
import { clearAll, purgeStaleVersions, readItem, removeItem, writeItem } from './storage'

/**
 * Data access for the app. Async on purpose: swapping this module for an HTTP client
 * later shouldn't change a single caller.
 */

const KEYS = { profile: 'profile', conversations: 'conversations', preferences: 'preferences' } as const

export const DEFAULT_PREFERENCES: Preferences = { theme: 'system' }

export interface AppData {
  profile: User | null
  users: User[]
  conversations: Conversation[]
  preferences: Preferences
}

export interface LoadResult {
  data: AppData
  /** True when stored data was corrupted and had to be replaced with defaults. */
  recovered: boolean
}

export async function loadAppData(): Promise<LoadResult> {
  purgeStaleVersions()
  const profile = readItem(KEYS.profile, isUser)
  const conversations = readItem(KEYS.conversations, isArrayOf(isConversation))
  const preferences = readItem(KEYS.preferences, isPreferences)

  const seeded = conversations.value ?? createSeedConversations()
  if (conversations.status !== 'ok') writeItem(KEYS.conversations, seeded)

  return {
    data: {
      profile: profile.value,
      // ponytail: the community is static demo data, not persisted; an API would return it here.
      users: DEMO_USERS,
      conversations: seeded,
      preferences: preferences.value ?? DEFAULT_PREFERENCES,
    },
    recovered: [profile, conversations, preferences].some((r) => r.status === 'invalid'),
  }
}

export async function saveProfile(profile: User | null): Promise<boolean> {
  if (profile === null) {
    removeItem(KEYS.profile)
    return true
  }
  return writeItem(KEYS.profile, profile)
}

export async function saveConversations(conversations: Conversation[]): Promise<boolean> {
  return writeItem(KEYS.conversations, conversations)
}

export async function savePreferences(preferences: Preferences): Promise<boolean> {
  return writeItem(KEYS.preferences, preferences)
}

export async function resetAppData(): Promise<AppData> {
  clearAll()
  return (await loadAppData()).data
}
