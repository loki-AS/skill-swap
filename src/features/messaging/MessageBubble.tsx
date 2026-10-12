import type { Message } from '../../types'
import { formatTime } from '../../utils/format'

export function MessageBubble({ message, outgoing }: { message: Message; outgoing: boolean }) {
  return (
    <li className={`bubble-row${outgoing ? ' bubble-row--out' : ''}`}>
      <div className={`bubble${outgoing ? ' bubble--out' : ' bubble--in'}`}>
        <span className="sr-only">{outgoing ? 'You' : 'They'} said: </span>
        <p className="bubble__text">{message.text}</p>
        <time className="bubble__time" dateTime={message.createdAt}>
          {formatTime(message.createdAt)}
        </time>
      </div>
    </li>
  )
}
