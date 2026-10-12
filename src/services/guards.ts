import { AVAILABILITY_OPTIONS, THEME_OPTIONS, type Conversation, type Message, type Preferences, type User } from '../types'

// Runtime shape checks for anything read back from storage (or, later, an API).

type Shape = Record<string, unknown>

const isObject = (v: unknown): v is Shape => typeof v === 'object' && v !== null && !Array.isArray(v)
const isString = (v: unknown): v is string => typeof v === 'string'
const isStringArray = (v: unknown): v is string[] => Array.isArray(v) && v.every(isString)
const isOneOf = <T extends string>(options: readonly T[]) => (v: unknown): v is T => options.includes(v as T)

export const isArrayOf =
  <T>(guard: (v: unknown) => v is T) =>
  (v: unknown): v is T[] =>
    Array.isArray(v) && v.every(guard)

export function isUser(v: unknown): v is User {
  return (
    isObject(v) &&
    ['id', 'name', 'avatar', 'headline', 'bio', 'location'].every((k) => isString(v[k])) &&
    isOneOf(AVAILABILITY_OPTIONS)(v.availability) &&
    isStringArray(v.teaches) &&
    isStringArray(v.learns)
  )
}

export function isMessage(v: unknown): v is Message {
  return isObject(v) && ['id', 'conversationId', 'senderId', 'text', 'createdAt'].every((k) => isString(v[k]))
}

export function isConversation(v: unknown): v is Conversation {
  return (
    isObject(v) &&
    isString(v.id) &&
    isString(v.createdAt) &&
    isString(v.lastReadAt) &&
    isStringArray(v.participantIds) &&
    isArrayOf(isMessage)(v.messages)
  )
}

export function isPreferences(v: unknown): v is Preferences {
  return isObject(v) && isOneOf(THEME_OPTIONS)(v.theme)
}
