# Skill Swap

Peer-to-peer skill exchange, built as a frontend-only web app. You list what you can teach and what you want to learn, and Skill Swap finds people where the exchange works **both ways**.

```
Register → Enter Skills → Store Profile → Search Skill → Find Match → Display Exchange
```

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # Vitest: matching, search, storage, messaging, validation
npm run lint       # ESLint, zero warnings allowed
npm run build      # tsc strict + production bundle
```

No backend. Everything is saved in `localStorage` under `skillswap:v1:*`. To start over, use **Settings → Reset demo**.

## Demo walkthrough

1. Open the app. First launch takes you to onboarding. Click **“Fill in a sample profile”** to see matches straight away.
2. Go through the four steps (About → Teach → Learn → Review). The preview on the right shows your mutual-match count as you edit.
3. **Discover** lists your best swaps, then the whole community. Search by text, by skill taught, by location, by category or by match type. All filters are kept in the URL.
4. Open a profile. **Why you match** shows the two lanes (what you teach them, what they teach you). For a one-way match, you can add one of their skills to your learning list with one click.
5. **Propose a swap** opens a pre-written first message. Sending it opens the chat.
6. Send more messages, refresh the page, and your data is still there.

## Architecture

```
src/
├── app/            App shell, routes, global state (AppProvider + useApp)
├── components/     Design-system primitives (Button, Field/Dropdown, Modal/Drawer, Tabs, Toast, SkillTag, States…)
├── features/
│   ├── matching/   matching.ts (pure engine) + MatchExplanation, MatchCard, MatchScore, MatchesPage
│   ├── discovery/  search.ts (pure filters) + DiscoverPage, FilterBar, ProfileCard
│   ├── messaging/  messaging.ts (pure) + MessagesPage, ChatThread, Composer, ConnectModal
│   ├── profile/    validation.ts + onboarding, edit, profile views
│   ├── skills/     normalisation helpers + SkillSelector
│   └── settings/
├── services/       storage.ts (the only localStorage access), guards.ts (runtime shape checks), repository.ts (async data API)
├── data/           skill catalog, demo users, seed conversations
├── hooks/          useMatches, useDebouncedValue
└── styles/         tokens.css (design tokens, light/dark) + component/layout/feature CSS
```

- **Matching rule:** `A.teaches ∩ B.learns ≠ ∅ AND B.teaches ∩ A.learns ≠ ∅` is a mutual match. If only one side holds, it's a one-way match. Skills are compared case-insensitively and with whitespace normalised.
- **Swapping in an API later:** components never touch storage. `services/repository.ts` exposes async functions, so it can be replaced with HTTP calls without changing any caller.
- **Storage safety:** every value read back is validated. Corrupted or wrongly shaped data is discarded, the user sees a notice, and the app falls back to defaults. A version bump purges old keys.

## For AI agents & contributors

Project context, architecture rules and conventions: [docs/CONTEXT.md](docs/CONTEXT.md).
