import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react'

interface FieldShellProps {
  label: string
  hint?: ReactNode
  error?: string
  /** Shows "current / max" under the field. */
  count?: { current: number; max: number }
  children: (ids: { inputId: string; describedBy: string | undefined }) => ReactNode
}

function FieldShell({ label, hint, error, count, children }: FieldShellProps) {
  const inputId = useId()
  const hintId = `${inputId}-hint`
  const errorId = `${inputId}-error`
  const describedBy = [hint && hintId, error && errorId].filter(Boolean).join(' ') || undefined
  return (
    <div className={`field${error ? ' field--invalid' : ''}`}>
      <label className="field__label" htmlFor={inputId}>
        {label}
      </label>
      {children({ inputId, describedBy })}
      <div className="field__meta">
        {error ? (
          <p id={errorId} className="field__error" role="alert">
            {error}
          </p>
        ) : (
          hint && (
            <p id={hintId} className="field__hint">
              {hint}
            </p>
          )
        )}
        {count && (
          <span className={`field__count${count.current > count.max ? ' field__count--over' : ''}`}>
            {count.current}/{count.max}
          </span>
        )}
      </div>
    </div>
  )
}

type Common = Pick<FieldShellProps, 'label' | 'hint' | 'error' | 'count'>

export function TextField({ label, hint, error, count, ...input }: Common & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <FieldShell label={label} hint={hint} error={error} count={count}>
      {({ inputId, describedBy }) => (
        <input id={inputId} className="input" aria-invalid={Boolean(error)} aria-describedby={describedBy} {...input} />
      )}
    </FieldShell>
  )
}

export function TextArea({ label, hint, error, count, ...input }: Common & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <FieldShell label={label} hint={hint} error={error} count={count}>
      {({ inputId, describedBy }) => (
        <textarea id={inputId} className="input input--area" aria-invalid={Boolean(error)} aria-describedby={describedBy} {...input} />
      )}
    </FieldShell>
  )
}

interface DropdownProps extends Common, Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  options: readonly string[]
  /** Label for the empty option, e.g. "Any location". Omit to force a choice. */
  placeholder?: string
}

/** Native select, styled — keyboard, screen-reader and mobile behaviour come for free. */
export function Dropdown({ label, hint, error, count, options, placeholder, ...select }: DropdownProps) {
  return (
    <FieldShell label={label} hint={hint} error={error} count={count}>
      {({ inputId, describedBy }) => (
        <select id={inputId} className="input input--select" aria-invalid={Boolean(error)} aria-describedby={describedBy} {...select}>
          {placeholder !== undefined && <option value="">{placeholder}</option>}
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      )}
    </FieldShell>
  )
}
