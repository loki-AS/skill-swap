import { useProfile } from '../../app/AppContext'
import { ButtonLink } from '../../components/Button'
import { useMatches } from '../../hooks/useMatches'
import { ProfileHeader, SkillPanels } from './ProfileView'

export function MyProfilePage() {
  const profile = useProfile()
  const { mutual, relevant } = useMatches()
  return (
    <div className="page">
      <ProfileHeader
        user={profile}
        actions={
          <>
            <ButtonLink to="/profile/edit" icon="edit">
              Edit profile
            </ButtonLink>
            <ButtonLink to="/matches" variant="secondary" icon="swap">
              {mutual.length} mutual · {relevant.length} one-way
            </ButtonLink>
          </>
        }
      />
      <SkillPanels user={profile} teachTitle="Skills I teach" learnTitle="Skills I want to learn" />
    </div>
  )
}
