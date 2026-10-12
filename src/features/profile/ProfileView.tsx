import type { ReactNode } from 'react'
import { Avatar } from '../../components/Avatar'
import { Icon } from '../../components/Icon'
import { SkillList } from '../../components/SkillTag'
import type { User } from '../../types'

interface ProfileHeaderProps {
  user: User
  actions?: ReactNode
  aside?: ReactNode
}

export function ProfileHeader({ user, actions, aside }: ProfileHeaderProps) {
  return (
    <header className="profile-header card">
      <div className="profile-header__banner" aria-hidden="true" />
      <div className="profile-header__body">
        <Avatar name={user.name} src={user.avatar} size="xl" decorative={false} />
        <div className="profile-header__info">
          <h1 className="display">{user.name}</h1>
          {user.headline && <p className="profile-header__headline">{user.headline}</p>}
          <p className="profile-card__meta">
            <Icon name="pin" size={15} /> {user.location}
            <span aria-hidden="true">·</span>
            <Icon name="clock" size={15} /> Available {user.availability.toLowerCase()}
          </p>
          {user.bio && <p className="profile-header__bio">{user.bio}</p>}
          {actions && <div className="row">{actions}</div>}
        </div>
        {aside}
      </div>
    </header>
  )
}

interface SkillPanelsProps {
  user: User
  teachTitle: string
  learnTitle: string
  teachHighlight?: string[]
  learnHighlight?: string[]
}

/** "Skills I teach" / "Skills I want to learn" — kept visually separate on purpose. */
export function SkillPanels({ user, teachTitle, learnTitle, teachHighlight, learnHighlight }: SkillPanelsProps) {
  return (
    <div className="skill-panels">
      <section className="card skill-panel skill-panel--teach" aria-labelledby="teach-heading">
        <h2 id="teach-heading" className="heading-sm">
          <Icon name="teach" size={18} /> {teachTitle}
        </h2>
        <SkillList skills={user.teaches} tone="teach" highlight={teachHighlight} />
      </section>
      <section className="card skill-panel skill-panel--learn" aria-labelledby="learn-heading">
        <h2 id="learn-heading" className="heading-sm">
          <Icon name="book" size={18} /> {learnTitle}
        </h2>
        <SkillList skills={user.learns} tone="learn" highlight={learnHighlight} />
      </section>
    </div>
  )
}
