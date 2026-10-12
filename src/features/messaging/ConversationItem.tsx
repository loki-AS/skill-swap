import { NavLink } from 'react-router-dom'
import { Avatar } from '../../components/Avatar'
import { CountBadge } from '../../components/Badge'
import { CURRENT_USER_ID } from '../../data/users'
import type { Conversation, User } from '../../types'
import { formatShortDate } from '../../utils/format'
import { getLastMessage, getUnreadCount } from './messaging'

export function ConversationItem({ conversation, partner }: { conversation: Conversation; partner: User }) {
  const last = getLastMessage(conversation)
  const unread = getUnreadCount(conversation, CURRENT_USER_ID)
  const preview = last ? `${last.senderId === CURRENT_USER_ID ? 'You: ' : ''}${last.text}` : 'New swap — say hello'
  return (
    <li>
      <NavLink to={`/messages/${conversation.id}`} className={`conversation-item${unread ? ' conversation-item--unread' : ''}`}>
        <Avatar name={partner.name} src={partner.avatar} size="md" />
        <span className="conversation-item__body">
          <span className="conversation-item__top">
            <span className="conversation-item__name">{partner.name}</span>
            <time className="conversation-item__time" dateTime={last?.createdAt ?? conversation.createdAt}>
              {formatShortDate(last?.createdAt ?? conversation.createdAt)}
            </time>
          </span>
          <span className="conversation-item__bottom">
            <span className="conversation-item__preview">{preview}</span>
            <CountBadge count={unread} label="unread messages" />
          </span>
        </span>
      </NavLink>
    </li>
  )
}
