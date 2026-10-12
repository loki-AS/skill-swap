import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router-dom'
import { Icon, type IconName } from './Icon'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'swap'
type Size = 'sm' | 'md' | 'lg'

interface StyleProps {
  variant?: Variant
  size?: Size
  icon?: IconName
  iconAfter?: IconName
  /** Icon-only button: children are hidden visually but kept for screen readers. */
  iconOnly?: boolean
  block?: boolean
  children: ReactNode
}

const classes = ({ variant = 'primary', size = 'md', iconOnly, block }: Omit<StyleProps, 'children'>, extra?: string) =>
  ['btn', `btn--${variant}`, `btn--${size}`, iconOnly && 'btn--icon', block && 'btn--block', extra].filter(Boolean).join(' ')

function Content({ icon, iconAfter, iconOnly, children }: StyleProps) {
  return (
    <>
      {icon && <Icon name={icon} size={18} />}
      <span className={iconOnly ? 'sr-only' : undefined}>{children}</span>
      {iconAfter && <Icon name={iconAfter} size={18} />}
    </>
  )
}

type ButtonProps = StyleProps & ButtonHTMLAttributes<HTMLButtonElement>

export function Button({ variant, size, icon, iconAfter, iconOnly, block, children, className, type = 'button', ...rest }: ButtonProps) {
  return (
    <button type={type} className={classes({ variant, size, iconOnly, block }, className)} {...rest}>
      <Content icon={icon} iconAfter={iconAfter} iconOnly={iconOnly}>
        {children}
      </Content>
    </button>
  )
}

type ButtonLinkProps = StyleProps & LinkProps

export function ButtonLink({ variant, size, icon, iconAfter, iconOnly, block, children, className, ...rest }: ButtonLinkProps) {
  return (
    <Link className={classes({ variant, size, iconOnly, block }, className)} {...rest}>
      <Content icon={icon} iconAfter={iconAfter} iconOnly={iconOnly}>
        {children}
      </Content>
    </Link>
  )
}
