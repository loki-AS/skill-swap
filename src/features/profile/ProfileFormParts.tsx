import { Dropdown, TextArea, TextField } from '../../components/Field'
import { LOCATIONS } from '../../data/skills'
import { AVAILABILITY_OPTIONS, type Availability } from '../../types'
import { SkillSelector } from '../skills/SkillSelector'
import { PhotoPicker } from './PhotoPicker'
import { PROFILE_LIMITS, type ProfileDraft, type ProfileErrors } from './validation'

export interface DraftFieldsProps {
  draft: ProfileDraft
  errors: ProfileErrors
  set: <K extends keyof ProfileDraft>(key: K, value: ProfileDraft[K]) => void
}

export function BasicInfoFields({ draft, errors, set }: DraftFieldsProps) {
  return (
    <div className="stack-md">
      <PhotoPicker name={draft.name} value={draft.avatar} onChange={(v) => set('avatar', v)} />
      <div className="form-grid">
        <TextField
          label="Full name"
          autoComplete="name"
          value={draft.name}
          error={errors.name}
          onChange={(e) => set('name', e.target.value)}
          required
        />
        <TextField
          label="Headline"
          hint="Your course, role or what you do — e.g. “CS undergrad · RV College”"
          value={draft.headline}
          error={errors.headline}
          onChange={(e) => set('headline', e.target.value)}
        />
        <TextField
          label="Location"
          hint="Pick a city or type your own"
          list="location-options"
          autoComplete="address-level2"
          value={draft.location}
          error={errors.location}
          onChange={(e) => set('location', e.target.value)}
          required
        />
        <datalist id="location-options">
          {LOCATIONS.map((l) => (
            <option key={l} value={l} />
          ))}
        </datalist>
        <Dropdown
          label="Availability"
          options={AVAILABILITY_OPTIONS}
          value={draft.availability}
          onChange={(e) => set('availability', e.target.value as Availability)}
        />
      </div>
      <TextArea
        label="Bio"
        hint="What do you love doing? What are you hoping to get out of a swap?"
        rows={4}
        value={draft.bio}
        error={errors.bio}
        count={{ current: draft.bio.length, max: PROFILE_LIMITS.bioMax }}
        onChange={(e) => set('bio', e.target.value)}
      />
    </div>
  )
}

export function TeachField({ draft, errors, set }: DraftFieldsProps) {
  return (
    <SkillSelector
      label="I can teach"
      description="Skills you’re confident sharing. This is what you bring to a swap."
      tone="teach"
      value={draft.teaches}
      conflicting={draft.learns}
      error={errors.teaches}
      onChange={(v) => set('teaches', v)}
    />
  )
}

export function LearnField({ draft, errors, set }: DraftFieldsProps) {
  return (
    <SkillSelector
      label="I want to learn"
      description="Skills you’d love someone to teach you. We match these against what others teach."
      tone="learn"
      value={draft.learns}
      conflicting={draft.teaches}
      error={errors.learns}
      onChange={(v) => set('learns', v)}
    />
  )
}
