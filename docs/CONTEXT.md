# Skill Swap — Project Context for AI Agents & Contributors

Read this before changing anything. It explains what the app is, how it is organised, and the rules the codebase follows. The original product brief is in [`../skillswap.md`](../skillswap.md). Read that for the "why", and this file for the "how it was built".

---

## 1. What this is

Skill Swap is a **frontend-only web app** for peer-to-peer skill exchange. Each user lists skills they **can teach** and skills they **want to learn**. The app finds people where the exchange works both ways (a *mutual match*), explains why, and lets the users chat.

Core loop: **Discover → Match → Understand the match → Connect → Chat**

### Hard scope rules (from the brief, don't break them)
- **Web only.** No React Native, Expo or mobile app.
- **No backend.** No Supabase, Firebase, API server, auth backend, realtime, payments or cloud storage.
- All data is **local mock data + `localStorage`**. The app must be fully demoable offline, and data must survive a browser refresh.
- Matching must be **real logic over the data**, never faked.

---

## 2. Stack & commands

| | |
|---|---|
| Framework | React 19 + TypeScript (strict, `noUncheckedIndexedAccess`) |
| Build | Vite |
| Routing | `react-router-dom` v7 (`BrowserRouter`) |
| Styling | Plain CSS with design tokens. **No Tailwind, no CSS-in-JS, no UI library.** |
| Tests | Vitest + jsdom (logic tests only, no component-testing library) |
| Lint | ESLint flat config (`eslint.config.js`): typescript-eslint, react-hooks, react-refresh |

```bash
npm install
npm run dev        # Vite dev server (default http://localhost:5173)
npm run typecheck  # tsc -b
npm run lint       # eslint . --max-warnings 0   ← zero warnings is required
npm test           # vitest run
npm run build      # tsc -b && vite build
```

**Definition of done for any change:** `typecheck`, `lint` (0 warnings), `test` and `build` all pass. For UI changes, also check the page in a browser at desktop, tablet (~800px) and phone (~390px) widths in **both light and dark** theme.

Fonts (Bricolage Grotesque for display, Figtree for body) load from Google Fonts in `index.html`, with system-font fallbacks. There are no other external network calls.

---

## 3. Folder map

```
src/
├── main.tsx                 Entry: mounts <App/>, imports the 5 CSS files in order
├── app/
│   ├── App.tsx              Routes, RequireProfile gate, ErrorBoundary, providers
│   ├── AppContext.ts        Context type + useApp() / useProfile() hooks
│   ├── AppProvider.tsx      Global state + actions; persists via repository
│   ├── AppShell.tsx         Sidebar nav (desktop), top bar + Drawer (mobile), <Outlet/>
│   └── Brand.tsx            Logo
├── components/              Reusable design-system primitives (no business logic)
│   ├── Button.tsx           Button + ButtonLink; variants primary|secondary|ghost|danger|swap
│   ├── Field.tsx            TextField, TextArea, Dropdown (styled native <select>)
│   ├── SearchInput.tsx
│   ├── Avatar.tsx           Photo or generated initials (hue from name)
│   ├── Badge.tsx            Badge + CountBadge
│   ├── SkillTag.tsx         SkillTag + SkillList (highlight / quiet / limit)
│   ├── Modal.tsx            Modal + Drawer (native <dialog>)
│   ├── Tabs.tsx             ARIA tabs with arrow-key navigation
│   ├── Toast.tsx            ToastProvider (+ toast-context.ts → useToast())
│   ├── States.tsx           EmptyState, ErrorState, Skeleton, LoadingState
│   └── Icon.tsx             Inline SVG icon set (add new paths here, no icon library)
├── features/
│   ├── matching/            matching.ts (PURE engine), labels.ts, MatchExplanation, MatchScore, MatchCard, MatchesPage
│   ├── discovery/           search.ts (PURE filters), filters.ts (URL ⇄ filters), DiscoverPage, FilterBar, ProfileCard
│   ├── messaging/           messaging.ts (PURE), intro.ts, useConnect, ConnectModal, MessagesPage, ChatThread, Composer, MessageBubble, ConversationItem
│   ├── profile/             validation.ts (PURE), useProfileDraft, OnboardingPage, EditProfilePage, MyProfilePage, PersonPage, ProfileView, ProfileFormParts, ProfilePreview, PhotoPicker
│   ├── skills/              skills.ts (normalise/canonicalise/categorise), SkillSelector
│   └── settings/            SettingsPage (theme, sign out, reset demo)
├── services/
│   ├── storage.ts           THE ONLY FILE that touches localStorage
│   ├── guards.ts            Runtime type guards for anything read from storage
│   └── repository.ts        Async data API used by AppProvider (swap for HTTP later)
├── data/
│   ├── skills.ts            Skill catalogue by category, LOCATIONS, limits
│   └── users.ts             DEMO_USERS, SAMPLE_PROFILE, seed conversations, CURRENT_USER_ID
├── hooks/                   useMatches (memoised match sets), useDebouncedValue
├── types/index.ts           User, Message, Conversation, Preferences, Match, MatchKind…
├── utils/format.ts          initials, hue, date/time formatting, pluralize
└── styles/                  tokens.css → base.css → components.css → layout.css → features.css
```

Tests sit next to the code they cover: `*.test.ts`.

---

## 4. Data model (`src/types/index.ts`)

```ts
User         { id, name, avatar, headline, bio, location, availability, teaches[], learns[] }
Message      { id, conversationId, senderId, text, createdAt (ISO) }
Conversation { id, participantIds[], messages[], createdAt, lastReadAt }   // lastReadAt drives unread counts
Preferences  { theme: 'system' | 'light' | 'dark' }
Match        { user, skills: { youTeach[], theyTeach[] }, kind, score (0–100) }
MatchKind    'mutual' | 'they-teach' | 'you-teach' | 'none'
```

- The current user always has id `CURRENT_USER_ID = 'me'` (`data/users.ts`).
- `avatar` is a data URL (an uploaded photo, downscaled to 256px JPEG) or `''`, which falls back to initials.
- `headline` is the "Department / profile info" field from the original C project.

---

## 5. Matching engine (`features/matching/matching.ts`) — the core of the product

```
mutual      ⇔  me.teaches ∩ them.learns ≠ ∅  AND  them.teaches ∩ me.learns ≠ ∅
they-teach  ⇔  only them.teaches ∩ me.learns ≠ ∅   (they can teach you)
you-teach   ⇔  only me.teaches ∩ them.learns ≠ ∅   (you can teach them)
none        ⇔  neither
```

- Skills are compared with `normalizeSkill()`: trim, collapse whitespace, lowercase. `" JavaScript "`, `"javascript"` and `"JavaScript"` are all equal.
- Score: mutual = 60 + 40 × coverage (60–100). One-way = 20 + 60 × coverage (20–50). None = 0. Coverage is the average share of each side's learn list that the other side can fill.
- API: `getMatchedSkills`, `getMatchKind`, `calculateCompatibility`, `getMatch`, `getAllMatches` (sorted by score, then name), `findMutualMatches`, `findRelevantMatches`, `isOneWay`.
- **Matches are derived, never stored.** UI code reads them through `useMatches()`, which memoises over the profile and users.

The "why you match" visual is `MatchExplanation`: two lanes (*You teach → they want*, *They teach → you want*) and a verdict ("Perfect Skill Swap" for mutual). It is the signature UI element, so keep it prominent.

---

## 6. State, persistence & storage

- **One global store**: `AppProvider` holds `{ status, profile, users, conversations, preferences }` and exposes these actions: `saveProfile`, `signOut`, `resetDemo`, `startConversation`, `sendMessage`, `markConversationRead`, `setTheme`, `retryLoad`. Components use `useApp()`, or `useProfile()` behind the profile gate.
- **Persistence**: effects in `AppProvider` save `conversations` and `preferences` whenever they change. `saveProfile` writes immediately. If a write fails (quota full or storage disabled), the user sees an error toast.
- **Storage keys**: `skillswap:v1:profile`, `skillswap:v1:conversations`, `skillswap:v1:preferences`.
  - Bump `STORAGE_VERSION` in `storage.ts` when the stored shape changes. Old versioned keys are purged on load.
  - Every read is validated by a guard in `guards.ts`. Invalid or corrupted data is deleted, defaults are used, and the user gets an info toast.
- **Demo users are not persisted.** They come from `DEMO_USERS`, the way an API would serve them. Seed conversations are written on first launch.
- **Future API:** replace the function bodies in `services/repository.ts` with HTTP calls. They are already `async`, so no caller has to change.

### Rules
- ❌ Never call `localStorage` outside `services/storage.ts`.
- ❌ Never put matching, search or validation logic inside JSX. Add it to the relevant pure `*.ts` module and test it there.
- ✅ Anything new that is read back from storage needs a guard in `guards.ts`.

---

## 7. Routes (`app/App.tsx`)

| Path | Page | Notes |
|---|---|---|
| `/welcome` | OnboardingPage | Outside the shell. Redirects to `/` if a profile exists |
| `/` | DiscoverPage | Filters live in the URL: `q, skill, location, category, match` |
| `/matches` | MatchesPage | Tabs: Mutual / One-way |
| `/people/:userId` | PersonPage | "Why you match" + one-click "add their skill to my learn list" |
| `/messages`, `/messages/:conversationId` | MessagesPage | Two panes on desktop, one pane on mobile |
| `/profile`, `/profile/edit` | MyProfilePage, EditProfilePage | |
| `/settings` | SettingsPage | Theme, sign out, reset demo (confirmed in a modal) |

Every shell route sits behind `RequireProfile`, which shows a loading skeleton, an error with retry, or a redirect to `/welcome`.

**Connect flow:** use `useConnect()` (`features/messaging/useConnect.tsx`) and never reimplement it. If a conversation already exists, it navigates there. Otherwise it opens `ConnectModal` with a pre-written opener from `intro.ts`, and Send calls `startConversation` and opens the chat.

---

## 8. Demo data invariants (tests depend on these)

`SAMPLE_PROFILE` (offered on onboarding step 1) teaches **C Programming, React** and wants **Canva, Photography, Guitar**. Against `DEMO_USERS` (18 people), that gives:

- **5 mutual:** Liam, Ananya, Rohan, Meera, Priya
- **5 one-way:** Kabir, Isha, Vikram, Aditya, Harsh
- **8 no overlap:** the rest

`search.test.ts` relies on specific users, for example *Canva + Bengaluru → only Ananya Rao*. If you edit demo users, re-run the tests and update both the tests and this section. Keep names realistic: no "User 1".

---

## 9. Design system

All colours, type, spacing, radii, shadows and motion are tokens in `styles/tokens.css`. **Use tokens. Never hard-code colours** except `#fff` on solid fills.

- **Theme:** tokens use CSS `light-dark()`. `<html data-theme="system|light|dark">` sets `color-scheme`. Every token must have a value for both themes.
- **Colour meaning (keep it consistent):**
  - `--teach` / `--teach-ink` / `--teach-soft` (coral) = what *you give*
  - `--learn` / `--learn-ink` / `--learn-soft` (teal) = what *you get*
  - `--mutual` (violet) = mutual match. **Buttons and badges use solid `--mutual`; the user explicitly asked for no gradients on buttons and badges.**
  - `--primary` (deep ink) = default primary action
  - Text on solid `--mutual` or `--primary` uses `--on-primary`, so it stays readable in both themes.
- `--swap-gradient` still exists for decorative surfaces only (profile banner, logo, headline text, tab underline, stepper connector). Don't reintroduce it on buttons, badges, card borders, chips or score rings.
- **Profile cards are intentionally calm:** skill chips are neutral grey (`SkillList quiet`), and only matched skills are coloured and outlined. The "swap strip" (YOU TEACH x ⇄ YOU LEARN y) is the main signal. Mutual cards get a thin solid violet border. Don't pile on extra badges.
- **CSS organisation:** BEM-ish class names (`block__element--modifier`). Primitives go in `components.css`, the app shell and pages in `layout.css`, and feature screens in `features.css`.
- **Motion:** short (`--dur*` tokens), purposeful entrance and hover only. `prefers-reduced-motion` turns it off globally (in `base.css`).

### Responsive rules (learned the hard way)
- Single-column grids must use `grid-template-columns: minmax(0, 1fr)`. An implicit `auto` column grows to fit unwrapped content (stepper labels, nowrap chips) and overflows its card. This already caused one layout bug.
- Use **container queries** for layout inside cards (`.onboarding__card` and `.form-section` set `container-type: inline-size`). Use media queries only for page-level layout.
- Breakpoints in use: 1280 (the side preview drops below the form), 1100, 900 (sidebar becomes top bar + drawer, Messages becomes single-pane), 600.
- No horizontal page scroll at any width from 320px up. The category pill rows are the one place that scrolls sideways, and that's on purpose.

---

## 10. Code conventions

- TypeScript strict. **No `any`, no `@ts-ignore` / `@ts-nocheck`.** ESLint errors on `no-explicit-any` and `ban-ts-comment`.
- Files that export React components export **only** components (react-refresh rule). Put contexts, hooks and constants in sibling `.ts` files (e.g. `AppContext.ts`, `toast-context.ts`, `labels.ts`).
- Don't call setState synchronously inside effects (react-hooks v7 rule). Adjust state during render, use a `key` to reset, or use refs inside effects.
- Prefer native platform features: `<dialog>` for modals, `<select>` for dropdowns, `<datalist>` for location suggestions, CSS for animation.
- **No new dependencies** without a strong reason. Check the installed packages first.
- Accessibility is required: semantic landmarks, labelled inputs, inline `role="alert"` errors, visible `:focus-visible`, keyboard support, `aria-live` for toasts, chat log and search counts, and alt text on photos.
- Validation lives in pure functions (`profile/validation.ts`, `messaging.validateMessage`). Show errors inline, never with `alert()`.
- Comments explain *why*, not *what*. Match the existing density.

---

## 11. How to…

- **Add a skill or category:** edit `SKILL_CATEGORIES` in `data/skills.ts`. Normalisation, suggestions and the category filters pick it up automatically.
- **Add a page:** create it under the right `features/*` folder, add a `<Route>` inside the shell in `App.tsx`, and add a nav item in `AppShell.tsx` if it belongs in the main flow. The brief says not to add screens that don't serve the Discover → Match → Connect → Learn workflow.
- **Add a persisted field:** extend the type, update its guard in `guards.ts`, and bump `STORAGE_VERSION` if old data can't satisfy the new guard.
- **Add an icon:** add a 24px stroke path to `PATHS` in `components/Icon.tsx`.
- **Swap to a real backend:** reimplement `services/repository.ts`. Load `users` from the API instead of `DEMO_USERS`, and keep the function signatures.

---

## 12. Known limitations / not built (by design)

- No real auth: "Sign out" just removes the local profile.
- No incoming messages beyond the seeded ones (no simulated replies), and no real-time updates.
- If browser back/forward changes the Discover `q` param while the page stays mounted, the search box takes on the URL's query. Other filters always read straight from the URL.
- Out of scope until a backend exists (the brief's "future" list): ratings, notifications and smart recommendations.

---

## 13. Pre-change checklist for agents

1. Read the files you'll touch, plus their callers (`grep` the function name).
2. Put logic in pure modules and UI in components. Add or extend a `*.test.ts` for any new logic.
3. Use the existing primitives (`Button`, `Field`, `SkillList`, `EmptyState`, `Modal`, `useConnect`, `useMatches`…) instead of writing new versions.
4. Use tokens for every colour and size, and check both themes and the 390px / 800px / desktop widths.
5. Run `npm run typecheck && npm run lint && npm test && npm run build`.
6. Update this file if you change architecture, invariants or design rules.
