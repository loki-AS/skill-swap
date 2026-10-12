import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import { useApp, useProfile } from '../../app/AppContext'
import { Button, ButtonLink } from '../../components/Button'
import { EmptyState } from '../../components/States'
import { CATEGORY_NAMES } from '../../data/skills'
import { useDebouncedValue } from '../../hooks/useDebouncedValue'
import { useMatches } from '../../hooks/useMatches'
import { firstName, pluralize } from '../../utils/format'
import { useConnect } from '../messaging/useConnect'
import { getSkillCategory } from '../skills/skills'
import { FilterBar } from './FilterBar'
import { readFilters, writeFilters } from './filters'
import { ProfileCard } from './ProfileCard'
import { EMPTY_FILTERS, filterMatches, hasActiveFilters, type SearchFilters } from './search'

const RECOMMENDED_COUNT = 3

export function DiscoverPage() {
  const profile = useProfile()
  const { users } = useApp()
  const matches = useMatches()
  const { connect, hasConversation, modal } = useConnect()
  const [params, setParams] = useSearchParams()
  const filters = readFilters(params)

  // Text input updates instantly; results and the URL follow after a short debounce.
  const [queryInput, setQueryInput] = useState(filters.query)
  const debouncedQuery = useDebouncedValue(queryInput)
  const searching = queryInput !== debouncedQuery
  const effectiveFilters: SearchFilters = { ...filters, query: debouncedQuery }

  // URL changed from outside (back/forward): adopt its query. Our own pushes already equal debouncedQuery.
  const [seenUrlQuery, setSeenUrlQuery] = useState(filters.query)
  if (filters.query !== seenUrlQuery) {
    setSeenUrlQuery(filters.query)
    if (filters.query !== debouncedQuery) setQueryInput(filters.query)
  }

  const lastPushed = useRef(filters.query)
  useEffect(() => {
    if (debouncedQuery === lastPushed.current) return
    lastPushed.current = debouncedQuery
    setParams((prev) => writeFilters({ ...readFilters(prev), query: debouncedQuery }), { replace: true })
  }, [debouncedQuery, setParams])

  // Sidebar "Search" action lands here and focuses the box.
  const searchRef = useRef<HTMLInputElement>(null)
  const location = useLocation()
  const focusSearch = (location.state as { focusSearch?: boolean } | null)?.focusSearch
  useEffect(() => {
    if (focusSearch) searchRef.current?.focus()
  }, [focusSearch, location.key])

  const update = (patch: Partial<SearchFilters>) => setParams(writeFilters({ ...effectiveFilters, ...patch }), { replace: true })
  const clearFilters = () => {
    setQueryInput('')
    setParams(writeFilters(EMPTY_FILTERS), { replace: true })
  }

  const skillOptions = useMemo(() => [...new Set(users.flatMap((u) => u.teaches))].sort((a, b) => a.localeCompare(b)), [users])
  const categoryOptions = useMemo(() => {
    const used = new Set(users.flatMap((u) => u.teaches.map(getSkillCategory)))
    return CATEGORY_NAMES.filter((c) => used.has(c))
  }, [users])

  const results = filterMatches(matches.all, effectiveFilters)
  const filtering = hasActiveFilters(effectiveFilters)
  const recommended = matches.mutual.slice(0, RECOMMENDED_COUNT)


  return (
    <div className="page">
      <header className="hero">
        <div>
          <p className="eyebrow">Discover</p>
          <h1 className="display">Hi {firstName(profile.name)}, who will you swap with?</h1>
          <p className="hero__lede">
            You teach <strong className="text-teach">{profile.teaches.join(', ')}</strong> and want to learn{' '}
            <strong className="text-learn">{profile.learns.join(', ')}</strong>.
          </p>
        </div>
        <dl className="stat-row">
          <div className="stat stat--mutual">
            <dt>Mutual matches</dt>
            <dd>{matches.mutual.length}</dd>
          </div>
          <div className="stat">
            <dt>One-way matches</dt>
            <dd>{matches.relevant.length}</dd>
          </div>
          <div className="stat">
            <dt>In the community</dt>
            <dd>{users.length}</dd>
          </div>
        </dl>
      </header>

      {!filtering && (
        <section className="section" aria-labelledby="recommended-heading">
          <div className="section__head">
            <h2 id="recommended-heading" className="heading">
              Best swaps for you
            </h2>
            {matches.mutual.length > RECOMMENDED_COUNT && (
              <ButtonLink to="/matches" variant="ghost" size="sm" iconAfter="arrowRight">
                All {matches.mutual.length} mutual matches
              </ButtonLink>
            )}
          </div>
          {recommended.length ? (
            <div className="card-grid">
              {recommended.map((m, i) => (
                <ProfileCard key={m.user.id} match={m} hasConversation={hasConversation(m.user.id)} onConnect={connect} index={i} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon="swap"
              title="No mutual matches yet"
              action={
                <ButtonLink to="/profile/edit" variant="primary" icon="edit">
                  Add more skills
                </ButtonLink>
              }
            >
              Nobody currently teaches what you want <em>and</em> wants what you teach. Adding a few more skills widens the net.
            </EmptyState>
          )}
        </section>
      )}

      <section className="section" aria-labelledby="community-heading">
        <div className="section__head">
          <h2 id="community-heading" className="heading">
            {filtering ? 'Search results' : 'Explore the community'}
          </h2>
          <p className="muted small" aria-live="polite">
            {pluralize(results.length, 'person')}
          </p>
        </div>
        <FilterBar
          filters={effectiveFilters}
          queryInput={queryInput}
          onQueryChange={setQueryInput}
          searchRef={searchRef}
          onChange={update}
          skillOptions={skillOptions}
          categoryOptions={categoryOptions}
        />
        {results.length ? (
          <div className={`card-grid${searching ? ' is-pending' : ''}`} aria-busy={searching}>
            {results.map((m, i) => (
              <ProfileCard key={m.user.id} match={m} hasConversation={hasConversation(m.user.id)} onConnect={connect} index={i} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon="search"
            title="No one matches that search"
            action={
              <Button variant="secondary" icon="refresh" onClick={clearFilters}>
                Clear filters
              </Button>
            }
          >
            Try a broader skill, another city, or switch to “Everyone”.
          </EmptyState>
        )}
      </section>
      {modal}
    </div>
  )
}
