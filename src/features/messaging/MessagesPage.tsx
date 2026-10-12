import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useApp } from '../../app/AppContext'
import { ButtonLink } from '../../components/Button'
import { SearchInput } from '../../components/SearchInput'
import { EmptyState, ErrorState } from '../../components/States'
import { CURRENT_USER_ID } from '../../data/users'
import { useMatches } from '../../hooks/useMatches'
import { normalizeSkill } from '../skills/skills'
import { ChatThread } from './ChatThread'
import { ConversationItem } from './ConversationItem'
import { getPartnerId, sortConversations } from './messaging'

export function MessagesPage() {
  const { conversationId } = useParams()
  const { conversations } = useApp()
  const { byUserId } = useMatches()
  const [query, setQuery] = useState('')

  // Pair each conversation with the partner's match; drop any whose partner no longer exists.
  const threads = useMemo(
    () =>
      sortConversations(conversations).flatMap((conversation) => {
        const match = byUserId.get(getPartnerId(conversation, CURRENT_USER_ID))
        return match ? [{ conversation, match }] : []
      }),
    [conversations, byUserId],
  )

  const q = normalizeSkill(query)
  const visible = q
    ? threads.filter(
        ({ conversation, match }) =>
          normalizeSkill(match.user.name).includes(q) || conversation.messages.some((m) => normalizeSkill(m.text).includes(q)),
      )
    : threads
  const active = threads.find((t) => t.conversation.id === conversationId)

  if (threads.length === 0) {
    return (
      <div className="page">
        <EmptyState
          icon="message"
          title="No conversations yet"
          action={
            <ButtonLink to="/matches" variant="swap" icon="swap">
              See your matches
            </ButtonLink>
          }
        >
          Connect with someone from your matches to start your first skill swap.
        </EmptyState>
      </div>
    )
  }

  return (
    <div className={`messages${conversationId ? ' messages--thread-open' : ''}`}>
      <aside className="messages__list" aria-label="Conversations">
        <div className="messages__list-head">
          <h1 className="heading">Messages</h1>
          <SearchInput label="Search conversations" placeholder="Search by name or message" value={query} onChange={setQuery} />
        </div>
        {visible.length ? (
          <ul className="conversation-list">
            {visible.map(({ conversation, match }) => (
              <ConversationItem key={conversation.id} conversation={conversation} partner={match.user} />
            ))}
          </ul>
        ) : (
          <p className="muted small messages__no-results">No conversations match “{query}”.</p>
        )}
      </aside>

      <div className="messages__thread">
        {active ? (
          <ChatThread key={active.conversation.id} conversation={active.conversation} match={active.match} />
        ) : conversationId ? (
          <ErrorState title="Conversation not found" action={<ButtonLink to="/messages">Back to messages</ButtonLink>}>
            It may have been removed when demo data was reset.
          </ErrorState>
        ) : (
          <EmptyState icon="message" title="Pick a conversation">
            Choose someone on the left to continue your swap.
          </EmptyState>
        )}
      </div>
    </div>
  )
}
