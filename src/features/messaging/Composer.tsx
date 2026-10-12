import { useState, type FormEvent, type KeyboardEvent } from 'react'
import { Button } from '../../components/Button'
import { MAX_MESSAGE_LENGTH, validateMessage } from './messaging'

interface ComposerProps {
  partnerName: string
  onSend: (text: string) => void
  /** Initial text. Remount with a new `key` to replace it (e.g. a tapped opener). */
  draft?: string
}

export function Composer({ partnerName, onSend, draft = '' }: ComposerProps) {
  const [text, setText] = useState(draft)
  const [error, setError] = useState<string | null>(null)

  const send = (e?: FormEvent) => {
    e?.preventDefault()
    const problem = validateMessage(text)
    if (problem) return setError(problem)
    onSend(text)
    setText('')
    setError(null)
  }

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault()
      send()
    }
  }

  const over = text.length > MAX_MESSAGE_LENGTH
  return (
    <form className="composer" onSubmit={send} noValidate>
      <label htmlFor="composer-input" className="sr-only">
        Message {partnerName}
      </label>
      <textarea
        id="composer-input"
        className="input composer__input"
        rows={1}
        autoFocus={Boolean(draft)}
        placeholder={`Message ${partnerName}…`}
        value={text}
        aria-invalid={Boolean(error) || over}
        aria-describedby={error ? 'composer-error' : 'composer-hint'}
        onChange={(e) => {
          setText(e.target.value)
          setError(null)
        }}
        onKeyDown={onKeyDown}
      />
      <Button type="submit" icon="send" disabled={!text.trim()}>
        Send
      </Button>
      <p className="composer__meta">
        {error ? (
          <span id="composer-error" className="field__error" role="alert">
            {error}
          </span>
        ) : (
          <span id="composer-hint" className="muted">
            Enter to send · Shift + Enter for a new line
          </span>
        )}
        {text.length > MAX_MESSAGE_LENGTH * 0.8 && (
          <span className={`field__count${over ? ' field__count--over' : ''}`}>
            {text.length}/{MAX_MESSAGE_LENGTH}
          </span>
        )}
      </p>
    </form>
  )
}
