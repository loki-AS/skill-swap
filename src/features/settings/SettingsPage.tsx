import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../app/AppContext'
import { Button } from '../../components/Button'
import { Modal } from '../../components/Modal'
import { useToast } from '../../components/toast-context'
import { THEME_OPTIONS, type Theme } from '../../types'

const THEME_LABELS: Record<Theme, string> = { system: 'Match my device', light: 'Light', dark: 'Dark' }

export function SettingsPage() {
  const { preferences, setTheme, signOut, resetDemo } = useApp()
  const toast = useToast()
  const navigate = useNavigate()
  const [confirmReset, setConfirmReset] = useState(false)

  const doReset = async () => {
    await resetDemo()
    setConfirmReset(false)
    toast('Demo data reset. Let’s set up your profile again.', 'info')
    navigate('/welcome', { replace: true })
  }

  const doSignOut = () => {
    signOut()
    navigate('/welcome', { replace: true })
  }

  return (
    <div className="page page--narrow">
      <header className="page-header">
        <p className="eyebrow">Settings</p>
        <h1 className="display">Settings</h1>
      </header>

      <section className="card form-section" aria-labelledby="appearance-heading">
        <h2 id="appearance-heading" className="heading-sm">
          Appearance
        </h2>
        <fieldset className="segmented segmented--wide">
          <legend className="field__label">Theme</legend>
          {THEME_OPTIONS.map((t) => (
            <label key={t} className="segmented__option">
              <input type="radio" name="theme" value={t} checked={preferences.theme === t} onChange={() => setTheme(t)} />
              <span>{THEME_LABELS[t]}</span>
            </label>
          ))}
        </fieldset>
      </section>

      <section className="card form-section" aria-labelledby="data-heading">
        <h2 id="data-heading" className="heading-sm">
          Your data
        </h2>
        <p className="muted small">
          Skill Swap is running as a demo: your profile, conversations and settings live only in this browser’s local storage.
        </p>
        <div className="settings-row">
          <div>
            <p className="strong">Sign out</p>
            <p className="muted small">Removes your profile from this browser. Conversations are kept.</p>
          </div>
          <Button variant="secondary" icon="logout" onClick={doSignOut}>
            Sign out
          </Button>
        </div>
        <div className="settings-row">
          <div>
            <p className="strong">Reset demo data</p>
            <p className="muted small">Deletes your profile and messages and restores the sample conversations.</p>
          </div>
          <Button variant="danger" icon="refresh" onClick={() => setConfirmReset(true)}>
            Reset demo
          </Button>
        </div>
      </section>

      <Modal
        open={confirmReset}
        onClose={() => setConfirmReset(false)}
        title="Reset all demo data?"
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmReset(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={doReset}>
              Yes, reset everything
            </Button>
          </>
        }
      >
        <p>Your profile, skills and every message you’ve sent will be deleted from this browser. This can’t be undone.</p>
      </Modal>
    </div>
  )
}
