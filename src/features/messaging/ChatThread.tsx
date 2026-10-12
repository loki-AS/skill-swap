import { Fragment, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../../app/AppContext'
import { Avatar } from '../../components/Avatar'
import { ButtonLink } from '../../components/Button'
import { Icon } from '../../components/Icon'
import { useToast } from '../../components/toast-context'
import { CURRENT_USER_ID } from '../../data/users'
import type { Conversation, Match } from '../../types'
import { firstName, formatDayHeading } from '../../utils/format'
import { suggestIntro } from './intro'
import { Composer } from './Composer'
import { MessageBubble } from './MessageBubble'
import { getUnreadCount } from './messaging'

interface ChatThreadProps {
  conversation: Conversation
  match: Match
}

function SwapLine({ match }: { match: Match }) {
  const { youTeach, theyTeach } = match.skills
  if (match.kind === 'none') return <span className="muted small">No skill overlap yet</span>
  return (
    <span className="chat-header__swap small">
      {youTeach.length > 0 && <span className="text-teach">You teach {youTeach.join(', ')}</span>}
      {youTeach.length > 0 && theyTeach.length > 0 && <Icon name="swap" size={14} />}
      {theyTeach.length > 0 && <span className="text-learn">You learn {theyTeach.join(', ')}</span>}
    </span>
  )
}

export function ChatThread({ conversation, match }: ChatThreadProps) {
  const { sendMessage, markConversationRead } = useApp()
  const toast = useToast()
  const partner = match.user
  const name = firstName(partner.name)
  const endRef = useRef<HTMLDivElement>(null)
  const [opener, setOpener] = useState({ text: '', n: 0 })
  const unread = getUnreadCount(conversation, CURRENT_USER_ID)

  useEffect(() => {
    if (unread > 0) markConversationRead(conversation.id)
  }, [unread, conversation.id, markConversationRead])

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' })
  }, [conversation.id, conversation.messages.length])

  const onSend = (text: string) => {
    sendMessage(conversation.id, text)
    if (conversation.messages.length === 0) toast(`First message sent to ${name}`)
  }

  const openers = [suggestIntro(match), `Hi ${name}! When are you usually free for a session?`]

  return (
    <section className="chat" aria-labelledby="chat-title">
      <header className="chat-header">
        <ButtonLink to="/messages" variant="ghost" size="sm" icon="back" iconOnly className="chat-header__back">
          All conversations
        </ButtonLink>
        <Avatar name={partner.name} src={partner.avatar} size="md" />
        <div className="grow min-w-0">
          <h2 id="chat-title" className="chat-header__name">
            <Link to={`/people/${partner.id}`}>{partner.name}</Link>
          </h2>
          <SwapLine match={match} />
        </div>
        {match.kind === 'mutual' && <span className="badge badge--mutual">Mutual match</span>}
      </header>

      <div className="chat__scroll">
        {conversation.messages.length === 0 ? (
          <div className="chat__empty">
            <Avatar name={partner.name} src={partner.avatar} size="lg" />
            <p className="heading-sm">Start your swap with {name}</p>
            <p className="muted small">Pick an opener to edit, or write your own below.</p>
            <ul className="opener-list">
              {openers.map((text) => (
                <li key={text}>
                  <button type="button" className="opener" onClick={() => setOpener((o) => ({ text, n: o.n + 1 }))}>
                    {text}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <ol className="message-list" role="log" aria-live="polite" aria-label={`Messages with ${partner.name}`}>
            {conversation.messages.map((m, i) => {
              const prev = conversation.messages[i - 1]
              const newDay = !prev || formatDayHeading(prev.createdAt) !== formatDayHeading(m.createdAt)
              return (
                <Fragment key={m.id}>
                  {newDay && (
                    <li className="day-divider" aria-hidden="true">
                      <span>{formatDayHeading(m.createdAt)}</span>
                    </li>
                  )}
                  <MessageBubble message={m} outgoing={m.senderId === CURRENT_USER_ID} />
                </Fragment>
              )
            })}
          </ol>
        )}
        <div ref={endRef} />
      </div>

      <Composer key={`${conversation.id}-${opener.n}`} partnerName={name} draft={opener.text} onSend={onSend} />
    </section>
  )
}
