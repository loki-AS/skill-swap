import type { User } from '../../types'
import { normalizeSkill } from '../skills/skills'

export type ProfileDraft = Omit<User, 'id'>
export type ProfileErrors = Partial<Record<keyof ProfileDraft, string>>

export const PROFILE_LIMITS = { nameMin: 2, nameMax: 50, headlineMax: 80, bioMax: 280 } as const

export function validateBasics(draft: ProfileDraft): ProfileErrors {
  const errors: ProfileErrors = {}
  const name = draft.name.trim()
  if (!name) errors.name = 'Tell people what to call you.'
  else if (name.length < PROFILE_LIMITS.nameMin) errors.name = `Use at least ${PROFILE_LIMITS.nameMin} characters.`
  else if (name.length > PROFILE_LIMITS.nameMax) errors.name = `Keep it under ${PROFILE_LIMITS.nameMax} characters.`
  if (draft.headline.length > PROFILE_LIMITS.headlineMax) errors.headline = `Keep it under ${PROFILE_LIMITS.headlineMax} characters.`
  if (!draft.location.trim()) errors.location = 'Add a city, or choose Remote.'
  if (draft.bio.length > PROFILE_LIMITS.bioMax) errors.bio = `Keep your bio under ${PROFILE_LIMITS.bioMax} characters.`
  return errors
}

export function validateTeaches(draft: ProfileDraft): ProfileErrors {
  return draft.teaches.length ? {} : { teaches: 'Add at least one skill you can teach — that’s your side of the swap.' }
}

export function validateLearns(draft: ProfileDraft): ProfileErrors {
  if (!draft.learns.length) return { learns: 'Add at least one skill you want to learn so we can find matches.' }
  const teachKeys = new Set(draft.teaches.map(normalizeSkill))
  const overlap = draft.learns.find((s) => teachKeys.has(normalizeSkill(s)))
  return overlap ? { learns: `“${overlap}” is on both lists — pick one.` } : {}
}

export function validateProfile(draft: ProfileDraft): ProfileErrors {
  return { ...validateBasics(draft), ...validateTeaches(draft), ...validateLearns(draft) }
}

export const isValid = (errors: ProfileErrors) => Object.keys(errors).length === 0

/** Cleans a draft before saving. */
export function toUser(draft: ProfileDraft, id: string): User {
  return { ...draft, id, name: draft.name.trim(), headline: draft.headline.trim(), bio: draft.bio.trim(), location: draft.location.trim() }
}
