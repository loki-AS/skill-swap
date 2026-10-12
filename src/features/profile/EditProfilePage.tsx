import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp, useProfile } from '../../app/AppContext'
import { Button } from '../../components/Button'
import { useToast } from '../../components/toast-context'
import { BasicInfoFields, LearnField, TeachField } from './ProfileFormParts'
import { ProfilePreview } from './ProfilePreview'
import { useProfileDraft } from './useProfileDraft'
import { isValid, toUser, validateProfile } from './validation'

export function EditProfilePage() {
  const profile = useProfile()
  const { saveProfile } = useApp()
  const toast = useToast()
  const navigate = useNavigate()
  const { id, ...initial } = profile
  const { draft, errors, setErrors, set, mutualCount } = useProfileDraft(initial)
  const fieldProps = { draft, errors, set }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const found = validateProfile(draft)
    setErrors(found)
    if (!isValid(found)) {
      toast('A few fields need attention before saving.', 'error')
      // Bring the first invalid field into view.
      requestAnimationFrame(() => document.querySelector<HTMLElement>('[aria-invalid="true"], .skill-selector--invalid input')?.focus())
      return
    }
    saveProfile(toUser(draft, id))
    toast('Profile updated — your matches have been refreshed.')
    navigate('/profile')
  }

  return (
    <div className="page">
      <header className="page-header">
        <p className="eyebrow">My profile</p>
        <h1 className="display">Edit profile</h1>
        <p className="muted">Changes to your skills instantly update who you match with.</p>
      </header>
      <div className="edit-layout">
        <form className="stack-lg" onSubmit={submit} noValidate>
          <section className="card form-section" aria-labelledby="basics-heading">
            <h2 id="basics-heading" className="heading-sm">
              Basic information
            </h2>
            <BasicInfoFields {...fieldProps} />
          </section>
          <section className="card form-section" aria-label="Skills you can teach">
            <TeachField {...fieldProps} />
          </section>
          <section className="card form-section" aria-label="Skills you want to learn">
            <LearnField {...fieldProps} />
          </section>
          <div className="form-actions">
            <Button variant="ghost" onClick={() => navigate('/profile')}>
              Cancel
            </Button>
            <Button type="submit" icon="check" size="lg">
              Save changes
            </Button>
          </div>
        </form>
        <ProfilePreview draft={draft} matchCount={mutualCount} />
      </div>
    </div>
  )
}
