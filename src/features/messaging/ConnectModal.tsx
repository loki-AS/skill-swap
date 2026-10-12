import { useState, type FormEvent } from 'react'
import { useProfile } from '../../app/AppContext'
import { Avatar } from '../../components/Avatar'
import { Button } from '../../components/Button'
import { TextArea } from '../../components/Field'
import { Icon } from '../../components/Icon'
import { Modal } from '../../components/Modal'
import type { Match } from '../../types'
import { firstName } from '../../utils/format'
import { MatchExplanation } from '../matching/MatchExplanation'
import { suggestIntro } from './intro'
import { MAX_MESSAGE_LENGTH, validateMessage } from './messaging'

interface ConnectModalProps {
  match: Match
  onClose: () => void
  onSend: (text: string) => void
}

/** Opening a new swap: shows the match one more time (with a celebration for mutual) and a pre-written opener. */
export function ConnectModal({ match, onClose, onSend }: ConnectModalProps) {
  const profile = useProfile()
  const [text, setText] = useState(() => suggestIntro(match))
  const [error, setError] = useState<string | null>(null)
  const mutual = match.kind === 'mutual'
  const name = firstName(match.user.name)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const problem = validateMessage(text)
    if (problem) return setError(problem)
    onSend(text)
  }

  return (
    <Modal open onClose={onClose} title={mutual ? 'It’s a Perfect Skill Swap!' : `Connect with ${name}`}>
      <form onSubmit={submit} className="stack-md" noValidate>
        <div className={`connect-hero${mutual ? ' connect-hero--mutual' : ''}`}>
          <Avatar name={profile.name} src={profile.avatar} size="lg" />
          <span className="connect-hero__swap">
            <Icon name="swap" size={22} />
          </span>
          <Avatar name={match.user.name} src={match.user.avatar} size="lg" />
        </div>
        {mutual && (
          <p className="center muted">
            You and {name} can each teach what the other wants to learn.
          </p>
        )}
        <MatchExplanation match={match} compact />
        <TextArea
          label={`Your first message to ${name}`}
          value={text}
          rows={4}
          maxLength={MAX_MESSAGE_LENGTH + 1}
          error={error ?? undefined}
          count={{ current: text.length, max: MAX_MESSAGE_LENGTH }}
          onChange={(e) => {
            setText(e.target.value)
            setError(null)
          }}
        />
        <div className="row row--end">
          <Button variant="ghost" onClick={onClose}>
            Not now
          </Button>
          <Button type="submit" variant={mutual ? 'swap' : 'primary'} icon="send">
            Send & open chat
          </Button>
        </div>
      </form>
    </Modal>
  )
}
