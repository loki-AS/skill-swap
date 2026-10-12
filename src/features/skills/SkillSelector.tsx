import { useId, useState, type KeyboardEvent } from 'react'
import { Button } from '../../components/Button'
import { Icon } from '../../components/Icon'
import { SkillTag, type SkillTone } from '../../components/SkillTag'
import { ALL_SKILLS, CATEGORY_NAMES, MAX_SKILL_LENGTH, MAX_SKILLS_PER_LIST } from '../../data/skills'
import { canonicalSkill, getSkillCategory, includesSkill, normalizeSkill } from './skills'

const MAX_SUGGESTIONS = 14

interface SkillSelectorProps {
  label: string
  description?: string
  tone: Exclude<SkillTone, 'neutral'>
  value: string[]
  onChange: (skills: string[]) => void
  /** Skills on the opposite list — can't be added here too. */
  conflicting?: string[]
  error?: string
}

/** Tag input with catalog suggestions. Free text is allowed; known skills snap to catalog casing. */
export function SkillSelector({ label, description, tone, value, onChange, conflicting = [], error }: SkillSelectorProps) {
  const id = useId()
  const [text, setText] = useState('')
  const [category, setCategory] = useState('')
  // `problem` is shown visually; `announcement` only goes to screen readers.
  const [problem, setProblem] = useState('')
  const [announcement, setAnnouncement] = useState('')

  const add = (raw: string) => {
    const skill = canonicalSkill(raw)
    if (!skill) return
    const issue =
      (includesSkill(value, skill) && `${skill} is already on this list.`) ||
      (includesSkill(conflicting, skill) && `${skill} is on your other list.`) ||
      (skill.length > MAX_SKILL_LENGTH && `Keep skill names under ${MAX_SKILL_LENGTH} characters.`) ||
      (value.length >= MAX_SKILLS_PER_LIST && `You can add up to ${MAX_SKILLS_PER_LIST} skills.`)
    if (issue) return setProblem(issue)
    onChange([...value, skill])
    setText('')
    setProblem('')
    setAnnouncement(`Added ${skill}.`)
  }

  const remove = (skill: string) => {
    onChange(value.filter((s) => s !== skill))
    setAnnouncement(`Removed ${skill}.`)
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      add(text)
    } else if (e.key === 'Backspace' && !text && value.length) {
      remove(value[value.length - 1] as string)
    }
  }

  const query = normalizeSkill(text)
  const suggestions = ALL_SKILLS.filter(
    (s) =>
      !includesSkill(value, s) &&
      !includesSkill(conflicting, s) &&
      (!category || getSkillCategory(s) === category) &&
      (!query || normalizeSkill(s).includes(query)),
  ).slice(0, MAX_SUGGESTIONS)

  const errorId = `${id}-error`
  return (
    <fieldset className={`skill-selector skill-selector--${tone}${error ? ' skill-selector--invalid' : ''}`} aria-describedby={error ? errorId : undefined}>
      <legend className="skill-selector__legend">
        <Icon name={tone === 'teach' ? 'teach' : 'book'} size={20} />
        {label}
      </legend>
      {description && <p className="muted small">{description}</p>}

      <div className="skill-selector__chosen" aria-label={`Selected: ${value.length} of ${MAX_SKILLS_PER_LIST}`} role="group">
        {value.length ? (
          <ul className="skill-list">
            {value.map((s) => (
              <li key={s} className="pop-in">
                <SkillTag skill={s} tone={tone} onRemove={() => remove(s)} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="skill-selector__empty">No skills yet — pick from the suggestions or type your own.</p>
        )}
      </div>

      <div className="skill-selector__input">
        <label htmlFor={`${id}-input`} className="sr-only">
          Add a skill to “{label}”
        </label>
        <input
          id={`${id}-input`}
          className="input"
          value={text}
          maxLength={MAX_SKILL_LENGTH + 10}
          placeholder="Type a skill and press Enter"
          onChange={(e) => {
            setText(e.target.value)
            setProblem('')
          }}
          onKeyDown={onKeyDown}
        />
        <Button variant="secondary" icon="plus" onClick={() => add(text)} disabled={!text.trim()}>
          Add
        </Button>
      </div>

      <div className="pill-row pill-row--scroll" role="group" aria-label="Filter suggestions by category">
        {['', ...CATEGORY_NAMES].map((c) => (
          <button key={c || 'all'} type="button" className="pill pill--sm" aria-pressed={category === c} onClick={() => setCategory(c)}>
            {c || 'Popular'}
          </button>
        ))}
      </div>

      <div className="skill-selector__suggestions" role="group" aria-label="Suggested skills">
        {suggestions.length ? (
          suggestions.map((s) => (
            <button key={s} type="button" className={`skill-tag skill-tag--suggest skill-tag--${tone}-soft`} onClick={() => add(s)}>
              <Icon name="plus" size={13} />
              {s}
            </button>
          ))
        ) : (
          <p className="muted small">
            {query ? <>No suggestions — press Enter to add “{text.trim()}” as a custom skill.</> : 'No more suggestions in this category.'}
          </p>
        )}
      </div>

      <p className="sr-only" aria-live="polite">
        {problem || announcement}
      </p>
      {problem && (
        <p className="field__hint" aria-hidden="true">
          {problem}
        </p>
      )}
      {error && (
        <p id={errorId} className="field__error" role="alert">
          {error}
        </p>
      )}
    </fieldset>
  )
}
