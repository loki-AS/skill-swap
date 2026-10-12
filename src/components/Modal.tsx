import { useEffect, useId, useRef, type ReactNode } from 'react'
import { Button } from './Button'

interface DialogProps {
  open: boolean
  onClose: () => void
  title: string
  /** Visually hide the title (it still labels the dialog). */
  hideTitle?: boolean
  children: ReactNode
  footer?: ReactNode
}

/**
 * Native <dialog>: focus trapping, Escape-to-close, inert background and focus restore
 * are handled by the browser.
 */
function BaseDialog({ open, onClose, title, hideTitle, children, footer, variant }: DialogProps & { variant: 'modal' | 'drawer' }) {
  const ref = useRef<HTMLDialogElement>(null)
  const titleId = useId()

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      className={`dialog dialog--${variant}`}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="dialog__panel">
        <header className="dialog__header">
          <h2 id={titleId} className={hideTitle ? 'sr-only' : 'dialog__title'}>
            {title}
          </h2>
          <Button variant="ghost" size="sm" icon="close" iconOnly onClick={onClose}>
            Close
          </Button>
        </header>
        <div className="dialog__body">{children}</div>
        {footer && <footer className="dialog__footer">{footer}</footer>}
      </div>
    </dialog>
  )
}

export function Modal(props: DialogProps) {
  return <BaseDialog {...props} variant="modal" />
}

/** Slide-in side panel, used for navigation on small screens. */
export function Drawer(props: DialogProps) {
  return <BaseDialog {...props} variant="drawer" />
}
