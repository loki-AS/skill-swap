import { useMemo, useState } from 'react'
import { useApp } from '../../app/AppContext'
import { CURRENT_USER_ID } from '../../data/users'
import { findMutualMatches } from '../matching/matching'
import { toUser, type ProfileDraft, type ProfileErrors } from './validation'

export const EMPTY_DRAFT: ProfileDraft = {
  name: '',
  avatar: '',
  headline: '',
  bio: '',
  location: '',
  availability: 'Flexible',
  teaches: [],
  learns: [],
}

/** Draft state for onboarding and profile editing, plus a live mutual-match count for the preview. */
export function useProfileDraft(initial: ProfileDraft) {
  const { users } = useApp()
  const [draft, setDraft] = useState(initial)
  const [errors, setErrors] = useState<ProfileErrors>({})

  const set = <K extends keyof ProfileDraft>(key: K, value: ProfileDraft[K]) => {
    setDraft((d) => ({ ...d, [key]: value }))
    // Clear a field's error as soon as the user touches it.
    setErrors(({ [key]: _cleared, ...rest }) => rest)
  }

  const mutualCount = useMemo(
    () => findMutualMatches(toUser(draft, CURRENT_USER_ID), users).length,
    [draft, users],
  )

  return { draft, setDraft, errors, setErrors, set, mutualCount }
}
