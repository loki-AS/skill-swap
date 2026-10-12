import { useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Avatar } from '../components/Avatar'
import { CountBadge } from '../components/Badge'
import { Button } from '../components/Button'
import { Drawer } from '../components/Modal'
import { Icon, type IconName } from '../components/Icon'
import { CURRENT_USER_ID } from '../data/users'
import { getUnreadCount } from '../features/messaging/messaging'
import { useMatches } from '../hooks/useMatches'
import { useApp, useProfile } from './AppContext'
import { Brand } from './Brand'

interface NavItem {
  to: string
  label: string
  icon: IconName
  step: string
  count?: number
  countLabel?: string
}

function NavLinks({ items, onNavigate }: { items: NavItem[]; onNavigate?: () => void }) {
  return (
    <ul className="nav__list">
      {items.map((item) => (
        <li key={item.to}>
          <NavLink to={item.to} end={item.to === '/' || item.to === '/profile'} className="nav__link" onClick={onNavigate}>
            <Icon name={item.icon} />
            <span className="grow">{item.label}</span>
            {item.count !== undefined && item.countLabel && <CountBadge count={item.count} label={item.countLabel} />}
            <span className="nav__step" aria-hidden="true">
              {item.step}
            </span>
          </NavLink>
        </li>
      ))}
    </ul>
  )
}

function Navigation({ onNavigate }: { onNavigate?: () => void }) {
  const profile = useProfile()
  const { conversations } = useApp()
  const { mutual } = useMatches()
  const navigate = useNavigate()
  const unread = conversations.reduce((sum, c) => sum + getUnreadCount(c, CURRENT_USER_ID), 0)

  // Order mirrors the product loop: Discover → Match → Connect → Learn.
  const primary: NavItem[] = [
    { to: '/', label: 'Discover', icon: 'compass', step: '1' },
    { to: '/matches', label: 'Matches', icon: 'swap', step: '2', count: mutual.length, countLabel: 'mutual matches' },
    { to: '/messages', label: 'Messages', icon: 'message', step: '3', count: unread, countLabel: 'unread messages' },
    { to: '/profile', label: 'My Profile', icon: 'user', step: '4' },
  ]

  return (
    <nav className="nav" aria-label="Main">
      <p className="nav__loop" aria-hidden="true">
        Discover <Icon name="arrowRight" size={12} /> Match <Icon name="arrowRight" size={12} /> Connect{' '}
        <Icon name="arrowRight" size={12} /> Learn
      </p>
      <NavLinks items={primary} onNavigate={onNavigate} />
      <div className="nav__secondary">
        <button
          type="button"
          className="nav__link"
          onClick={() => {
            onNavigate?.()
            navigate('/', { state: { focusSearch: true } })
          }}
        >
          <Icon name="search" />
          <span>Search people</span>
        </button>
        <NavLink to="/profile/edit" className="nav__link" onClick={onNavigate}>
          <Icon name="edit" />
          <span>Edit profile</span>
        </NavLink>
        <NavLink to="/settings" className="nav__link" onClick={onNavigate}>
          <Icon name="settings" />
          <span>Settings</span>
        </NavLink>
      </div>
      <Link to="/profile" className="nav__me" onClick={onNavigate}>
        <Avatar name={profile.name} src={profile.avatar} size="sm" />
        <span className="min-w-0">
          <span className="nav__me-name">{profile.name}</span>
          <span className="nav__me-meta">
            Teaches {profile.teaches.length} · Learning {profile.learns.length}
          </span>
        </span>
      </Link>
    </nav>
  )
}

export function AppShell() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  return (
    <div className="shell">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <aside className="shell__sidebar">
        <Brand />
        <Navigation />
      </aside>

      <header className="shell__topbar">
        <Button variant="ghost" icon="menu" iconOnly onClick={() => setMenuOpen(true)} aria-expanded={menuOpen}>
          Open menu
        </Button>
        <Brand />
      </header>
      <Drawer open={menuOpen} onClose={() => setMenuOpen(false)} title="Menu" hideTitle>
        <Navigation onNavigate={() => setMenuOpen(false)} />
      </Drawer>

      <main id="main" className="shell__main" tabIndex={-1}>
        {/* Keyed by path so each page gets a short entrance transition. */}
        <div key={location.pathname.split('/')[1]} className="route-fade">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
