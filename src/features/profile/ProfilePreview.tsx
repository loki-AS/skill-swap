import { Avatar } from '../../components/Avatar'
import { Icon } from '../../components/Icon'
import { SkillList } from '../../components/SkillTag'
import type { ProfileDraft } from './validation'

/** Live card showing how others will see the profile while it's being edited. */
export function ProfilePreview({ draft, matchCount }: { draft: ProfileDraft; matchCount?: number }) {
  return (
    <aside className="profile-preview" aria-label="Profile preview">
      <p className="eyebrow">Preview</p>
      <div className="card profile-card profile-card--preview">
        <div className="profile-card__head">
          <Avatar name={draft.name || '?'} src={draft.avatar} size="md" />
          <div className="min-w-0">
            <p className="profile-card__name">{draft.name.trim() || 'Your name'}</p>
            <p className="profile-card__meta">
              <Icon name="pin" size={14} /> {draft.location.trim() || 'Your city'}
            </p>
          </div>
        </div>
        {draft.headline.trim() && <p className="small muted">{draft.headline}</p>}
        <p className="profile-card__bio">{draft.bio.trim() || 'Your bio will appear here.'}</p>
        <div>
          <p className="eyebrow eyebrow--teach">Teaches</p>
          <SkillList skills={draft.teaches} tone="teach" emptyText="Add skills you can teach" />
        </div>
        <div>
          <p className="eyebrow eyebrow--learn">Wants to learn</p>
          <SkillList skills={draft.learns} tone="learn" emptyText="Add skills you want to learn" />
        </div>
      </div>
      {matchCount !== undefined && (
        <p className={`preview-matches${matchCount ? ' preview-matches--live' : ''}`} aria-live="polite">
          <Icon name="swap" size={16} />
          {matchCount
            ? `${matchCount} mutual ${matchCount === 1 ? 'match' : 'matches'} waiting for you`
            : 'Add skills to both lists to see your mutual matches'}
        </p>
      )}
    </aside>
  )
}
