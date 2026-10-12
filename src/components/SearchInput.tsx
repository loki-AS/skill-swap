import type { ComponentProps } from 'react'
import { Icon } from './Icon'

interface SearchInputProps extends Omit<ComponentProps<'input'>, 'onChange' | 'value' | 'type'> {
  label: string
  value: string
  onChange: (value: string) => void
}

export function SearchInput({ label, value, onChange, className, ...rest }: SearchInputProps) {
  return (
    <div className={`search-input ${className ?? ''}`}>
      <Icon name="search" size={18} className="search-input__icon" />
      <input
        type="search"
        className="input search-input__field"
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        {...rest}
      />
      {value && (
        <button type="button" className="search-input__clear" onClick={() => onChange('')} aria-label="Clear search">
          <Icon name="close" size={16} />
        </button>
      )}
    </div>
  )
}
