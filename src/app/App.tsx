import { Component, type ReactNode } from 'react'
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { Button, ButtonLink } from '../components/Button'
import { ErrorState, LoadingState } from '../components/States'
import { ToastProvider } from '../components/Toast'
import { DiscoverPage } from '../features/discovery/DiscoverPage'
import { MatchesPage } from '../features/matching/MatchesPage'
import { MessagesPage } from '../features/messaging/MessagesPage'
import { EditProfilePage } from '../features/profile/EditProfilePage'
import { MyProfilePage } from '../features/profile/MyProfilePage'
import { OnboardingPage } from '../features/profile/OnboardingPage'
import { PersonPage } from '../features/profile/PersonPage'
import { SettingsPage } from '../features/settings/SettingsPage'
import { useApp } from './AppContext'
import { AppProvider } from './AppProvider'
import { AppShell } from './AppShell'

/** Gate for the main app: waits for data, sends first-time visitors to onboarding. */
function RequireProfile() {
  const { status, profile, retryLoad } = useApp()
  if (status === 'loading') {
    return (
      <div className="page">
        <LoadingState label="Loading Skill Swap" />
      </div>
    )
  }
  if (status === 'error') {
    return (
      <div className="page">
        <ErrorState title="We couldn’t load your data" action={<Button onClick={retryLoad} icon="refresh">Try again</Button>}>
          Your browser may be blocking local storage.
        </ErrorState>
      </div>
    )
  }
  return profile ? <Outlet /> : <Navigate to="/welcome" replace />
}

function NotFound() {
  return (
    <div className="page">
      <ErrorState title="Page not found" action={<ButtonLink to="/">Go to Discover</ButtonLink>}>
        That link doesn’t lead anywhere on Skill Swap.
      </ErrorState>
    </div>
  )
}

/** Last-resort catch for render errors, with a recovery path. */
class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    if (!this.state.failed) return this.props.children
    return (
      <div className="page">
        <ErrorState
          title="Something broke on this screen"
          action={
            <Button icon="refresh" onClick={() => window.location.assign('/')}>
              Reload Skill Swap
            </Button>
          }
        >
          Your data is safe in this browser. Reloading usually fixes it.
        </ErrorState>
      </div>
    )
  }
}

export function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ToastProvider>
          <AppProvider>
            <Routes>
              <Route path="/welcome" element={<OnboardingGate />} />
              <Route element={<RequireProfile />}>
                <Route element={<AppShell />}>
                  <Route index element={<DiscoverPage />} />
                  <Route path="matches" element={<MatchesPage />} />
                  <Route path="people/:userId" element={<PersonPage />} />
                  <Route path="messages" element={<MessagesPage />} />
                  <Route path="messages/:conversationId" element={<MessagesPage />} />
                  <Route path="profile" element={<MyProfilePage />} />
                  <Route path="profile/edit" element={<EditProfilePage />} />
                  <Route path="settings" element={<SettingsPage />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Route>
            </Routes>
          </AppProvider>
        </ToastProvider>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

function OnboardingGate() {
  const { status } = useApp()
  return status === 'ready' ? <OnboardingPage /> : null
}
