import { loadAppData, saveConversations } from '../../services/repository'
import {
  appendMessage,
  createConversation,
  createMessage,
  getUnreadCount,
  markRead,
  sortConversations,
  validateMessage,
} from './messaging'

const at = (iso: string) => new Date(iso)

describe('messaging', () => {
  beforeEach(() => localStorage.clear())

  it('sends a message into the right conversation', () => {
    const c1 = createConversation('me', 'u1', at('2026-01-01T10:00:00Z'))
    const c2 = createConversation('me', 'u2', at('2026-01-01T10:00:00Z'))
    const msg = createMessage(c1.id, 'me', '  Hello!  ', at('2026-01-01T10:01:00Z'))
    const [next1, next2] = appendMessage([c1, c2], msg)
    expect(next1?.messages).toEqual([msg])
    expect(msg.text).toBe('Hello!')
    expect(next2?.messages).toEqual([])
  })

  it('keeps messages in chronological order', () => {
    const c = createConversation('me', 'u1')
    const later = createMessage(c.id, 'me', 'second', at('2026-01-01T10:05:00Z'))
    const earlier = createMessage(c.id, 'u1', 'first', at('2026-01-01T10:01:00Z'))
    const [result] = appendMessage(appendMessage([c], later), earlier)
    expect(result?.messages.map((m) => m.text)).toEqual(['first', 'second'])
  })

  it('persists conversations across reloads', async () => {
    const c = createConversation('me', 'u1')
    const updated = appendMessage([c], createMessage(c.id, 'me', 'persist me'))
    await saveConversations(updated)
    const { data } = await loadAppData()
    expect(data.conversations[0]?.messages[0]?.text).toBe('persist me')
  })

  it('counts unread incoming messages and clears them on read', () => {
    const c = createConversation('me', 'u1', at('2026-01-01T10:00:00Z'))
    let convs = appendMessage([c], createMessage(c.id, 'u1', 'hi', at('2026-01-01T10:01:00Z')))
    convs = appendMessage(convs, createMessage(c.id, 'me', 'hey', at('2026-01-01T10:02:00Z')))
    expect(getUnreadCount(convs[0]!, 'me')).toBe(1)
    convs = markRead(convs, c.id, at('2026-01-01T10:03:00Z'))
    expect(getUnreadCount(convs[0]!, 'me')).toBe(0)
  })

  it('sorts conversations by latest activity', () => {
    const old = createConversation('me', 'u1', at('2026-01-01T09:00:00Z'))
    const fresh = createConversation('me', 'u2', at('2026-01-01T08:00:00Z'))
    const convs = appendMessage([old, fresh], createMessage(fresh.id, 'u2', 'new', at('2026-01-01T11:00:00Z')))
    expect(sortConversations(convs).map((c) => c.id)).toEqual([fresh.id, old.id])
  })

  it('validates message input', () => {
    expect(validateMessage('   ')).not.toBeNull()
    expect(validateMessage('x'.repeat(1001))).not.toBeNull()
    expect(validateMessage('Hi there')).toBeNull()
  })
})
