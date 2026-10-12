import { useState } from 'react'
import { ButtonLink } from '../../components/Button'
import { EmptyState } from '../../components/States'
import { Tabs } from '../../components/Tabs'
import { useMatches } from '../../hooks/useMatches'
import type { Match } from '../../types'
import { useConnect } from '../messaging/useConnect'
import { MatchCard } from './MatchCard'

type TabId = 'mutual' | 'relevant'

export function MatchesPage() {
  const { mutual, relevant } = useMatches()
  const { connect, hasConversation, modal } = useConnect()
  const [tab, setTab] = useState<TabId>(mutual.length || !relevant.length ? 'mutual' : 'relevant')

  const list = (matches: Match[]) => (
    <div className="match-list">
      {matches.map((m, i) => (
        <MatchCard key={m.user.id} match={m} index={i} onConnect={connect} hasConversation={hasConversation(m.user.id)} />
      ))}
    </div>
  )

  return (
    <div className="page">
      <header className="page-header">
        <p className="eyebrow">Matches</p>
        <h1 className="display">Your skill swaps</h1>
        <p className="muted">
          A <strong>mutual match</strong> means you each teach something the other wants to learn. One-way matches are still
          worth a hello.
        </p>
      </header>

      <Tabs
        label="Match type"
        active={tab}
        onChange={setTab}
        tabs={[
          { id: 'mutual', label: <>Mutual <span className="tab-count">{mutual.length}</span></> },
          { id: 'relevant', label: <>One-way <span className="tab-count">{relevant.length}</span></> },
        ]}
      >
        {tab === 'mutual' &&
          (mutual.length ? (
            list(mutual)
          ) : (
            <EmptyState
              icon="swap"
              title="No mutual matches yet"
              action={
                <ButtonLink to="/profile/edit" icon="edit">
                  Update your skills
                </ButtonLink>
              }
            >
              Add more skills you can teach, or more you want to learn — every new skill is another chance at a two-way swap.
            </EmptyState>
          ))}
        {tab === 'relevant' &&
          (relevant.length ? (
            list(relevant)
          ) : (
            <EmptyState icon="compass" title="No one-way matches" action={<ButtonLink to="/">Explore everyone</ButtonLink>}>
              Nobody in the community overlaps with your skills in just one direction right now.
            </EmptyState>
          ))}
      </Tabs>
      {modal}
    </div>
  )
}
