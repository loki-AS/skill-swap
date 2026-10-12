import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useApp } from '../../app/AppContext'
import { Button } from '../../components/Button'
import { Icon } from '../../components/Icon'
import { useToast } from '../../components/toast-context'
import { CURRENT_USER_ID, SAMPLE_PROFILE } from '../../data/users'
import { firstName } from '../../utils/format'
import { Brand } from '../../app/Brand'
import { BasicInfoFields, LearnField, TeachField, type DraftFieldsProps } from './ProfileFormParts'
import { ProfilePreview } from './ProfilePreview'
import { EMPTY_DRAFT, useProfileDraft } from './useProfileDraft'
import {
  isValid,
  toUser,
  validateBasics,
  validateLearns,
  validateProfile,
  validateTeaches,
  type ProfileDraft,
  type ProfileErrors,
} from './validation'

interface Step {
  title: string
  intro: string
  validate: (d: ProfileDraft) => ProfileErrors
  Fields: (props: DraftFieldsProps & { mutualCount: number }) => ReactNode
}

const STEPS: Step[] = [
  {
    title: 'About you',
    intro: 'Let people know who they’ll be learning with.',
    validate: validateBasics,
    Fields: BasicInfoFields,
  },
  {
    title: 'What can you teach?',
    intro: 'Everyone knows something worth sharing — a language, a tool, a craft.',
    validate: validateTeaches,
    Fields: TeachField,
  },
  {
    title: 'What do you want to learn?',
    intro: 'We’ll look for people who teach these and want what you teach.',
    validate: validateLearns,
    Fields: LearnField,
  },
  {
    title: 'Looking good!',
    intro: 'Here’s your profile. You can change any of this later.',
    validate: validateProfile,
    Fields: ({ draft, mutualCount }) => <ProfilePreview draft={draft} matchCount={mutualCount} />,
  },
]

export function OnboardingPage() {
  const { profile, saveProfile } = useApp()
  const toast = useToast()
  const navigate = useNavigate()
  const { draft, setDraft, errors, setErrors, set, mutualCount } = useProfileDraft(EMPTY_DRAFT)
  const [stepIndex, setStepIndex] = useState(0)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const firstRender = useRef(true)

  useEffect(() => {
    // Move focus to the new step's heading so keyboard and screen-reader users land in the right place.
    if (firstRender.current) firstRender.current = false
    else headingRef.current?.focus()
  }, [stepIndex])

  if (profile) return <Navigate to="/" replace />

  const step = STEPS[stepIndex] as Step
  const isLast = stepIndex === STEPS.length - 1

  const next = (e: FormEvent) => {
    e.preventDefault()
    const stepErrors = step.validate(draft)
    setErrors(stepErrors)
    if (!isValid(stepErrors)) return
    if (!isLast) return setStepIndex((i) => i + 1)
    saveProfile(toUser(draft, CURRENT_USER_ID))
    toast(`Welcome to Skill Swap, ${firstName(draft.name)}!`)
    navigate('/', { replace: true })
  }

  const back = () => {
    setErrors({})
    setStepIndex((i) => Math.max(0, i - 1))
  }

  return (
    <div className="onboarding">
      <div className="onboarding__intro">
        <Brand />
        <h1 className="display display--xl">
          Learn from people.
          <br />
          <span className="text-gradient">Share what you know.</span>
        </h1>
        <ol className="flow-steps" aria-label="How Skill Swap works">
          <li>
            <Icon name="teach" size={18} /> Tell us what you can teach
          </li>
          <li>
            <Icon name="book" size={18} /> Add what you want to learn
          </li>
          <li>
            <Icon name="swap" size={18} /> Meet people who want exactly that exchange
          </li>
        </ol>
      </div>

      <main className="onboarding__main">
        <form className="card onboarding__card" onSubmit={next} noValidate>
          <ol className="stepper" aria-label="Profile setup progress">
            {STEPS.map((s, i) => (
              <li
                key={s.title}
                className={`stepper__step${i < stepIndex ? ' is-done' : ''}`}
                aria-current={i === stepIndex ? 'step' : undefined}
              >
                <span className="stepper__dot">{i < stepIndex ? <Icon name="check" size={14} /> : i + 1}</span>
                <span className="stepper__label">{s.title.replace('?', '')}</span>
              </li>
            ))}
          </ol>
          <p className="sr-only" aria-live="polite">
            Step {stepIndex + 1} of {STEPS.length}: {step.title}
          </p>

          <div className="onboarding__step" key={stepIndex}>
            <h2 ref={headingRef} tabIndex={-1} className="heading">
              {step.title}
            </h2>
            <p className="muted">{step.intro}</p>
            {stepIndex === 0 && (
              <button
                type="button"
                className="sample-fill"
                onClick={() => setDraft({ ...SAMPLE_PROFILE, avatar: draft.avatar })}
              >
                <Icon name="sparkle" size={16} /> Just exploring? Fill in a sample profile
              </button>
            )}
            <step.Fields draft={draft} errors={errors} set={set} mutualCount={mutualCount} />
          </div>

          <div className="onboarding__nav">
            {stepIndex > 0 ? (
              <Button variant="ghost" icon="back" onClick={back}>
                Back
              </Button>
            ) : (
              <span />
            )}
            <Button type="submit" variant={isLast ? 'swap' : 'primary'} iconAfter={isLast ? 'check' : 'arrowRight'} size="lg">
              {isLast ? 'Create my profile' : 'Continue'}
            </Button>
          </div>
        </form>
        {!isLast && (
          <ProfilePreview draft={draft} matchCount={draft.teaches.length && draft.learns.length ? mutualCount : undefined} />
        )}
      </main>
    </div>
  )
}
