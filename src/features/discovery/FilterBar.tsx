import type { Ref } from 'react'
import { Dropdown } from '../../components/Field'
import { SearchInput } from '../../components/SearchInput'
import { LOCATIONS } from '../../data/skills'
import type { MatchFilter, SearchFilters } from './search'

const MATCH_OPTIONS: { id: MatchFilter; label: string }[] = [
  { id: 'all', label: 'Everyone' },
  { id: 'mutual', label: 'Mutual' },
  { id: 'relevant', label: 'One-way' },
]

interface FilterBarProps {
  filters: SearchFilters
  queryInput: string
  onQueryChange: (value: string) => void
  onChange: (patch: Partial<SearchFilters>) => void
  skillOptions: readonly string[]
  categoryOptions: readonly string[]
  searchRef?: Ref<HTMLInputElement>
}

export function FilterBar({ filters, queryInput, onQueryChange, onChange, skillOptions, categoryOptions, searchRef }: FilterBarProps) {
  return (
    <section className="filter-bar card" aria-label="Search and filters">
      <div className="filter-bar__row">
        <SearchInput
          ref={searchRef}
          label="Search people, skills or locations"
          placeholder="Search a skill, name or city — try “JavaScript”"
          value={queryInput}
          onChange={onQueryChange}
          className="grow"
        />
        <div className="filter-bar__selects">
          <Dropdown
            label="Can teach"
            placeholder="Any skill"
            options={skillOptions}
            value={filters.skill}
            onChange={(e) => onChange({ skill: e.target.value })}
          />
          <Dropdown
            label="Location"
            placeholder="Anywhere"
            options={LOCATIONS}
            value={filters.location}
            onChange={(e) => onChange({ location: e.target.value })}
          />
        </div>
      </div>
      <div className="filter-bar__row filter-bar__row--wrap">
        <fieldset className="segmented">
          <legend className="sr-only">Match type</legend>
          {MATCH_OPTIONS.map((o) => (
            <label key={o.id} className="segmented__option">
              <input
                type="radio"
                name="match-type"
                value={o.id}
                checked={filters.matchType === o.id}
                onChange={() => onChange({ matchType: o.id })}
              />
              <span>{o.label}</span>
            </label>
          ))}
        </fieldset>
        <div className="pill-row" role="group" aria-label="Skill category">
          {['', ...categoryOptions].map((cat) => (
            <button
              key={cat || 'all'}
              type="button"
              className="pill"
              aria-pressed={filters.category === cat}
              onClick={() => onChange({ category: cat })}
            >
              {cat || 'All categories'}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
