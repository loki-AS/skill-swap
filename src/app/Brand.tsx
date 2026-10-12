import { Link } from 'react-router-dom'

export function Brand() {
  return (
    <Link to="/" className="brand" aria-label="Skill Swap home">
      <span className="brand__mark" aria-hidden="true">
        <svg viewBox="0 0 32 32" width="20" height="20">
          <path d="M8 12h14l-4-4M24 20H10l4 4" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span className="brand__name">
        Skill<span>Swap</span>
      </span>
    </Link>
  )
}
