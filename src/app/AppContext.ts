import { createContext, useContext } from 'react'
import type { AppData } from '../services/repository'
import type { Theme, User } from '../types'

export type LoadStatus = 'loading' | 'ready' | 'error'

export interface AppActions {
  saveProfile: (profile: User) => void
  signOut: () => void
  resetDemo: () => Promise<void>
  /** Returns the existing conversation with this user, or creates one. Optional first message. */
  startConversation: (userId: string, firstMessage?: string) => string
  sendMessage: (conversationId: string, text: string) => void
  markConversationRead: (conversationId: string) => void
  setTheme: (theme: Theme) => void
  retryLoad: () => void
}

export interface AppState extends AppData, AppActions {
  status: LoadStatus
}

export const AppContext = createContext<AppState | null>(null)

export function useApp(): AppState {
  const state = useContext(AppContext)
  if (!state) throw new Error('useApp must be used inside <AppProvider>')
  return state
}

/** For screens rendered behind <RequireProfile>, where a profile is guaranteed. */
export function useProfile(): User {
  const { profile } = useApp()
  if (!profile) throw new Error('useProfile called without a profile')
  return profile
}
