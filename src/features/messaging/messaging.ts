import type { Conversation, Message } from '../../types'

export const MAX_MESSAGE_LENGTH = 1000

export function createId(prefix: string): string {
  return `${prefix}_${crypto.randomUUID()}`
}

export function validateMessage(text: string): string | null {
  if (!text.trim()) return 'Write a message before sending.'
  if (text.length > MAX_MESSAGE_LENGTH) return `Keep messages under ${MAX_MESSAGE_LENGTH} characters.`
  return null
}

export function createMessage(conversationId: string, senderId: string, text: string, now = new Date()): Message {
  return { id: createId('msg'), conversationId, senderId, text: text.trim(), createdAt: now.toISOString() }
}

export function createConversation(currentUserId: string, otherUserId: string, now = new Date()): Conversation {
  const ts = now.toISOString()
  return { id: createId('conv'), participantIds: [currentUserId, otherUserId], messages: [], createdAt: ts, lastReadAt: ts }
}

export function sortMessages(messages: readonly Message[]): Message[] {
  return [...messages].sort((a, b) => a.createdAt.localeCompare(b.createdAt))
}

/** Appends and keeps messages chronological, even if a timestamp arrives out of order. */
export function appendMessage(conversations: readonly Conversation[], message: Message): Conversation[] {
  return conversations.map((c) =>
    c.id === message.conversationId ? { ...c, messages: sortMessages([...c.messages, message]) } : c,
  )
}

export function markRead(conversations: readonly Conversation[], conversationId: string, now = new Date()): Conversation[] {
  return conversations.map((c) => (c.id === conversationId ? { ...c, lastReadAt: now.toISOString() } : c))
}

export function getPartnerId(conversation: Conversation, currentUserId: string): string {
  return conversation.participantIds.find((id) => id !== currentUserId) ?? currentUserId
}

export function findConversationWith(conversations: readonly Conversation[], userId: string): Conversation | undefined {
  return conversations.find((c) => c.participantIds.includes(userId))
}

export function getLastMessage(conversation: Conversation): Message | undefined {
  return conversation.messages.at(-1)
}

export function getUnreadCount(conversation: Conversation, currentUserId: string): number {
  return conversation.messages.filter((m) => m.senderId !== currentUserId && m.createdAt > conversation.lastReadAt).length
}

const lastActivity = (c: Conversation) => getLastMessage(c)?.createdAt ?? c.createdAt

export function sortConversations(conversations: readonly Conversation[]): Conversation[] {
  return [...conversations].sort((a, b) => lastActivity(b).localeCompare(lastActivity(a)))
}
