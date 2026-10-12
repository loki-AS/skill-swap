import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../app/AppContext'
import { useToast } from '../../components/toast-context'
import type { Match } from '../../types'
import { firstName } from '../../utils/format'
import { ConnectModal } from './ConnectModal'
import { findConversationWith } from './messaging'

/**
 * Connect / Message action shared by cards and profiles.
 * Existing conversation → jump straight to it. New → open the connect modal first.
 */
export function useConnect() {
  const { conversations, startConversation } = useApp()
  const navigate = useNavigate()
  const toast = useToast()
  const [pending, setPending] = useState<Match | null>(null)

  const hasConversation = (userId: string) => Boolean(findConversationWith(conversations, userId))

  const connect = (match: Match) => {
    const existing = findConversationWith(conversations, match.user.id)
    if (existing) navigate(`/messages/${existing.id}`)
    else setPending(match)
  }

  const modal = pending && (
    <ConnectModal
      match={pending}
      onClose={() => setPending(null)}
      onSend={(text) => {
        const id = startConversation(pending.user.id, text)
        toast(`Swap request sent to ${firstName(pending.user.name)}`)
        setPending(null)
        navigate(`/messages/${id}`)
      }}
    />
  )

  return { connect, hasConversation, modal }
}
