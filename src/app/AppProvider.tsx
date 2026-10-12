import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useToast } from '../components/toast-context'
import { CURRENT_USER_ID } from '../data/users'
import {
  appendMessage,
  createConversation,
  createMessage,
  findConversationWith,
  markRead,
} from '../features/messaging/messaging'
import {
  DEFAULT_PREFERENCES,
  loadAppData,
  resetAppData,
  saveConversations,
  savePreferences,
  saveProfile as persistProfile,
  type AppData,
} from '../services/repository'
import type { Theme, User } from '../types'
import { AppContext, type AppState, type LoadStatus } from './AppContext'

const EMPTY_DATA: AppData = { profile: null, users: [], conversations: [], preferences: DEFAULT_PREFERENCES }
const SAVE_FAILED = 'Couldn’t save to this browser — storage may be full or disabled.'

export function AppProvider({ children }: { children: ReactNode }) {
  const toast = useToast()
  const [status, setStatus] = useState<LoadStatus>('loading')
  const [data, setData] = useState<AppData>(EMPTY_DATA)
  const load = useCallback(() => {
    loadAppData()
      .then(({ data: loaded, recovered }) => {
        setData(loaded)
        setStatus('ready')
        if (recovered) toast('Some saved data was unreadable and has been reset.', 'info')
      })
      .catch(() => setStatus('error'))
  }, [toast])

  useEffect(load, [load])

  const retryLoad = useCallback(() => {
    setStatus('loading')
    load()
  }, [load])

  // Persist slices as they change. Skips the initial empty state.
  const persist = useCallback(
    (save: Promise<boolean>) => save.then((ok) => ok || toast(SAVE_FAILED, 'error')),
    [toast],
  )
  useEffect(() => {
    if (status === 'ready') void persist(saveConversations(data.conversations))
  }, [data.conversations, status, persist])
  useEffect(() => {
    if (status === 'ready') void persist(savePreferences(data.preferences))
  }, [data.preferences, status, persist])

  useEffect(() => {
    document.documentElement.dataset.theme = data.preferences.theme
  }, [data.preferences.theme])

  const saveProfile = useCallback(
    (profile: User) => {
      setData((d) => ({ ...d, profile }))
      void persist(persistProfile(profile))
    },
    [persist],
  )

  const signOut = useCallback(() => {
    setData((d) => ({ ...d, profile: null }))
    void persistProfile(null)
  }, [])

  const resetDemo = useCallback(async () => {
    setData(await resetAppData())
  }, [])

  const startConversation = useCallback(
    (userId: string, firstMessage?: string) => {
      const existing = findConversationWith(data.conversations, userId)
      const conversation = existing ?? createConversation(CURRENT_USER_ID, userId)
      setData((d) => {
        let conversations = existing ? d.conversations : [conversation, ...d.conversations]
        if (firstMessage) conversations = appendMessage(conversations, createMessage(conversation.id, CURRENT_USER_ID, firstMessage))
        return { ...d, conversations }
      })
      return conversation.id
    },
    [data.conversations],
  )

  const sendMessage = useCallback((conversationId: string, text: string) => {
    const message = createMessage(conversationId, CURRENT_USER_ID, text)
    setData((d) => ({ ...d, conversations: markRead(appendMessage(d.conversations, message), conversationId) }))
  }, [])

  const markConversationRead = useCallback((conversationId: string) => {
    setData((d) => ({ ...d, conversations: markRead(d.conversations, conversationId) }))
  }, [])

  const setTheme = useCallback((theme: Theme) => {
    setData((d) => ({ ...d, preferences: { ...d.preferences, theme } }))
  }, [])

  const value = useMemo<AppState>(
    () => ({
      ...data,
      status,
      saveProfile,
      signOut,
      resetDemo,
      startConversation,
      sendMessage,
      markConversationRead,
      setTheme,
      retryLoad,
    }),
    [data, status, saveProfile, signOut, resetDemo, startConversation, sendMessage, markConversationRead, setTheme, retryLoad],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
