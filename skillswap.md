\# Build Skill Swap — Modern Web Application Frontend



You are a senior frontend architect, product designer, and UI engineer.



Build a \*\*complete, polished, production-quality web application frontend\*\* for a peer-to-peer skill exchange platform called \*\*Skill Swap\*\*.



This is a \*\*NEW APPLICATION\*\* and is completely separate from any previous mobile application work.



\## 1. PRODUCT UNDERSTANDING



Skill Swap is a peer-learning platform where people exchange skills with each other without monetary transactions.



The core value loop is:



\*\*User offers skills → User wants to learn skills → System finds reciprocal matches → Users discover each other → Users communicate directly\*\*



Example:



\* User A can teach: `C Programming`

\* User A wants to learn: `Canva`

\* User B can teach: `Canva`

\* User B wants to learn: `C Programming`



The system identifies them as a \*\*mutual skill-swap match\*\*.



The original project defines the flow as:



\*\*Register → Enter Skills → Store Profile → Search Skill → Find Match → Display Exchange\*\*



and the core processing concept is:



\*\*Input → Store → Search → Compare → Match → Display\*\*



Preserve this product concept throughout the entire UI and user experience.



\---



\# 2. IMPORTANT SCOPE



This is a:



\*\*WEB APPLICATION ONLY\*\*



Do NOT build:



\* React Native

\* Expo

\* mobile application

\* Supabase

\* Firebase

\* backend APIs

\* database server

\* authentication backend

\* real-time infrastructure

\* payment system

\* external messaging service

\* cloud storage



The application must be fully functional as a \*\*frontend prototype/application\*\* using local mock data and browser storage.



Use:



\* React

\* TypeScript

\* modern CSS / Tailwind if already configured

\* React Router

\* localStorage for persistence

\* mock JSON/object data

\* reusable components

\* responsive web layouts



If the existing repository already has a frontend stack, inspect it first and work with the existing architecture rather than unnecessarily replacing it.



\---



\# 3. FIRST — INSPECT THE EXISTING PROJECT



Before writing code:



1\. Inspect the complete repository.

2\. Identify the existing framework and build system.

3\. Identify existing components and design system.

4\. Identify routing.

5\. Identify existing styling approach.

6\. Identify existing assets.

7\. Identify package versions.

8\. Identify linting and TypeScript configuration.

9\. Identify testing setup.

10\. Reuse useful infrastructure where appropriate.



Do not blindly rewrite the project.



If the repository is empty, establish a clean modern React + TypeScript web architecture.



\---



\# 4. PRODUCT MODULES



The application should be organized around these major modules:



\### A. User Profile



Users should be able to create and manage a profile containing:



\* Name

\* Profile picture

\* Bio

\* Location

\* Skills they can teach

\* Skills they want to learn



The original data model is conceptually:



```text

Student/User

├── ID

├── Name

├── Department / Profile information

├── Skills to Teach

└── Skills to Learn

```



For the expanded web application, adapt this into a richer user profile without losing the original concept.



\---



\### B. Skills Offered



Users can specify multiple skills they are qualified or willing to teach.



Examples:



\* C Programming

\* JavaScript

\* React

\* Python

\* Canva

\* Photoshop

\* Video Editing

\* Public Speaking

\* Photography

\* Guitar



Use a polished tag/chip-based interface.



Support:



\* add skill

\* remove skill

\* search skills

\* select suggested skills

\* display skill categories if useful



\---



\### C. Skills Desired



Users can specify multiple skills they want to learn.



Use the same polished interaction model as Skills Offered.



Clearly distinguish:



\*\*I Can Teach\*\*



from



\*\*I Want To Learn\*\*



This distinction is fundamental to the matchmaking experience.



\---



\# 5. DISCOVERY / MATCHING



Create a primary discovery experience where users can discover compatible skill partners.



The most important algorithm is \*\*reciprocal matching\*\*.



For User A and User B:



```text

User A teaches something User B wants to learn

AND

User B teaches something User A wants to learn

```



When both conditions are satisfied:



```text

Mutual Skill Match

```



Implement this matching logic entirely on the frontend using TypeScript/JavaScript over local mock data.



Do not fake the matching result.



The UI should visually explain WHY two users matched.



For example:



```text

You teach      → C Programming

They want      → C Programming



They teach     → Canva

You want       → Canva



✓ Mutual Skill Match

```



This should become one of the strongest visual elements of the product.



\---



\# 6. DISCOVERY DASHBOARD



Create a modern dashboard for discovering people.



Include:



\* Search

\* Skill filters

\* Location filter

\* Match relevance

\* Skill categories

\* Mutual matches

\* Recommended people

\* Profile cards

\* Empty state

\* Loading state

\* No-result state



Use a responsive CSS Grid.



Each profile card should contain:



\* Avatar

\* Name

\* Location

\* Short bio

\* Skills they teach

\* Skills they want

\* Match percentage or compatibility indicator where appropriate

\* Shared/matched skills

\* View Profile button

\* Connect / Start Chat action



Avoid making the UI feel like a generic social network.



The product should feel specifically designed around \*\*skill exchange\*\*.



\---



\# 7. SEARCH



Implement a real frontend search experience.



Users should be able to search profiles by:



\* Skill

\* Person name

\* Location



Use debounced search if appropriate.



Filtering should work against the local dataset.



Support combinations such as:



```text

Skill: Canva

Location: Bengaluru

```



or:



```text

Search: JavaScript

```



Search results should update dynamically.



\---



\# 8. PROFILE EXPERIENCE



Create a detailed profile page.



The profile should show:



\### Profile Header



\* Large avatar

\* Name

\* Location

\* Bio

\* Availability/status if useful

\* Connect / Message action



\### Skills I Teach



Display visually prominent skill chips/cards.



\### Skills I Want To Learn



Display desired skills separately.



\### Why You Match



If viewing another user from the discovery system, explain the reciprocal relationship.



Example:



```text

You can teach:

React



They want:

React



They can teach:

Photography



You want:

Photography

```



Then show:



\*\*Perfect Skill Swap\*\*



\---



\# 9. CHAT / MESSAGING



The requirements include a direct communication interface between matched users.



Build a complete frontend chat experience.



Desktop layout:



```text

┌─────────────────────────────────────────────┐

│ Conversations │ Active Conversation         │

│               │                             │

│ User A        │ Header                      │

│ User B        │                             │

│ User C        │ Message                     │

│               │ Message                     │

│               │                             │

│               │ Message input      Send      │

└─────────────────────────────────────────────┘

```



Implement:



\* Conversation list

\* Active conversation

\* Message history

\* Incoming messages

\* Outgoing messages

\* Timestamps

\* Message input

\* Send button

\* Empty conversation state

\* Search conversations

\* Unread indicators



Messages should be persisted in `localStorage`.



Sending a message should immediately update the UI.



No backend is required.



Use realistic mock conversations.



\---



\# 10. PROFILE CREATION / ONBOARDING



Create a polished onboarding/profile setup flow.



The user should be able to enter:



\### Basic Information



\* Name

\* Profile photo

\* Location

\* Bio



\### Skills



\*\*What can you teach?\*\*



\*\*What do you want to learn?\*\*



Make this feel like a guided experience rather than a plain HTML form.



Use:



\* progress indicators where appropriate

\* skill suggestions

\* tag inputs

\* validation

\* helpful empty states

\* preview of the resulting profile



Persist the created profile locally.



\---



\# 11. APPLICATION NAVIGATION



Create a proper web application navigation system.



Recommended primary navigation:



\* Dashboard / Discover

\* Matches

\* Messages

\* My Profile



Secondary/navigation actions:



\* Edit Profile

\* Settings

\* Search

\* Logout/demo reset



Use a polished desktop navigation/sidebar/header system.



The navigation should clearly communicate:



\*\*Discover → Match → Connect → Learn\*\*



Do not create unnecessary pages simply to increase the number of screens.



Every page must support the actual Skill Swap workflow.



\---



\# 12. MATCHES PAGE



Create a dedicated Matches page.



Separate:



\### Mutual Matches



People where both sides can teach something the other wants.



\### Relevant Matches



People where there is only a one-way skill relationship.



For example:



```text

Mutual Match

You teach: C

They want: C



They teach: Canva

You want: Canva

```



Give mutual matches higher visual priority.



Include:



\* match cards

\* matched skills

\* compatibility explanation

\* profile preview

\* message/connect action



\---



\# 13. LOCAL DATA ARCHITECTURE



Since there is no backend, create a clean mock data layer.



Use realistic sample users.



Example conceptual structure:



```ts

type User = {

&#x20; id: string;

&#x20; name: string;

&#x20; avatar: string;

&#x20; bio: string;

&#x20; location: string;

&#x20; teaches: string\[];

&#x20; learns: string\[];

};



type Message = {

&#x20; id: string;

&#x20; conversationId: string;

&#x20; senderId: string;

&#x20; text: string;

&#x20; createdAt: string;

};



type Conversation = {

&#x20; id: string;

&#x20; participantIds: string\[];

&#x20; messages: Message\[];

};

```



Create a frontend service/repository layer rather than scattering localStorage calls throughout components.



Example:



```text

src/

├── app/

├── components/

├── features/

│   ├── profile/

│   ├── skills/

│   ├── discovery/

│   ├── matching/

│   ├── messaging/

│   └── settings/

├── services/

├── data/

├── hooks/

├── utils/

├── types/

└── styles/

```



Use feature-oriented organization.



\---



\# 14. LOCALSTORAGE



Persist important application state locally.



At minimum:



\* current user

\* profile

\* skills

\* matches

\* conversations

\* messages

\* user preferences



Create a clean storage abstraction.



Do not directly call:



```ts

localStorage.setItem(...)

```



throughout random components.



Centralize storage access.



Handle:



\* missing data

\* corrupted JSON

\* first launch

\* reset demo data

\* migrations/versioning if useful



\---



\# 15. DEMO DATA



Create enough realistic data to make the application feel alive.



Include users with different combinations of:



\* programming

\* design

\* photography

\* music

\* marketing

\* communication

\* languages

\* video editing

\* academics

\* creative skills

\* productivity tools



Make sure the dataset produces:



\* several mutual matches

\* one-way matches

\* no-match scenarios

\* different locations

\* different skill combinations



Do not use repetitive placeholder names such as:



```text

User 1

User 2

User 3

```



Use believable sample profiles.



\---



\# 16. DESIGN DIRECTION



Do NOT make this look like a basic college CRUD project.



The source project is academically focused, but the web application should feel like a \*\*modern real-world product\*\*.



Design it as a polished peer-learning marketplace/community platform.



Visual characteristics:



\* modern

\* clean

\* friendly

\* approachable

\* intelligent

\* youthful

\* collaborative

\* premium but not corporate

\* strong visual hierarchy

\* generous whitespace

\* excellent typography

\* subtle depth

\* tasteful gradients

\* refined cards

\* smooth interactions



The design should communicate:



\*\*Learn from people. Share what you know.\*\*



Avoid copying the visual identity of:



\* LinkedIn

\* Fiverr

\* Facebook

\* Discord

\* WhatsApp

\* Airbnb



Take inspiration from modern product design patterns, but create an original visual identity for Skill Swap.



\---



\# 17. DESIGN SYSTEM



Create a centralized design system.



Define:



\### Colors



Primary brand color



Secondary/accent colors



Background colors



Surface colors



Text hierarchy



Success



Warning



Error



Info



Match/mutual-match accent



\### Typography



Define:



\* display

\* heading

\* body

\* caption

\* labels



\### Spacing



Use a consistent spacing scale.



\### Components



Create reusable:



\* Button

\* Input

\* SearchInput

\* Avatar

\* Badge

\* SkillTag

\* SkillSelector

\* ProfileCard

\* MatchCard

\* Modal

\* Drawer

\* Dropdown

\* Tabs

\* Toast

\* EmptyState

\* LoadingState

\* ErrorState

\* Skeleton

\* MessageBubble

\* ConversationItem



Do not duplicate UI implementations.



\---



\# 18. RESPONSIVE WEB DESIGN



This is a WEB application.



It must work properly on:



\* Desktop

\* Laptop

\* Tablet

\* Mobile browser



However, do not turn it into a mobile app.



The desktop experience is the primary experience.



Use responsive web patterns:



\* CSS Grid

\* Flexbox

\* media queries

\* responsive containers

\* responsive typography

\* responsive navigation



The desktop layout should feel spacious and intentional.



The tablet/mobile browser layout should gracefully collapse columns and navigation.



\---



\# 19. STATES



Every major feature needs proper UI states.



Implement:



\### Loading



Use skeleton loaders where appropriate.



\### Empty



Examples:



\* No matches

\* No conversations

\* No search results

\* No skills selected

\* Empty profile



\### Error



Provide useful recovery actions.



\### Success



Show confirmation after:



\* profile creation

\* profile update

\* skill changes

\* message send

\* connection/match action



\### First-time experience



The first launch should guide the user toward completing their profile.



\---



\# 20. MICRO-INTERACTIONS



Use subtle animations.



Examples:



\* profile card hover

\* skill tag addition

\* search transitions

\* match reveal

\* button feedback

\* modal transitions

\* message appearance

\* navigation transitions

\* toast notifications

\* card hover elevation

\* mutual-match celebration



Animations should be fast and purposeful.



Do not over-animate the application.



\---



\# 21. ACCESSIBILITY



Follow proper semantic HTML.



Use:



\* semantic landmarks

\* correct heading hierarchy

\* labels

\* keyboard navigation

\* visible focus states

\* accessible buttons

\* accessible dialogs

\* ARIA only when necessary

\* sufficient contrast

\* meaningful alt text



The requirements specifically call for semantic standards and accessible document architecture.



\---



\# 22. FORMS



Use proper form validation.



Validate:



\* required name

\* bio constraints

\* location

\* at least one teaching skill where appropriate

\* skill selection

\* message input



Show inline validation errors.



Do not rely only on browser alerts.



\---



\# 23. FRONTEND MATCHING ENGINE



Create a dedicated matching utility/service.



Example conceptual API:



```ts

findMutualMatches(currentUser, users)



findRelevantMatches(currentUser, users)



calculateCompatibility(currentUser, otherUser)



getMatchedSkills(currentUser, otherUser)

```



Keep matching logic independent from React components.



The UI should consume the matching engine rather than implementing business logic directly inside JSX.



\---



\# 24. MATCHING RULE



The core reciprocal algorithm must follow:



```text

A.teaches intersects B.learns

AND

B.teaches intersects A.learns

```



For example:



```text

A.teaches = \["C", "React"]

A.learns  = \["Canva"]



B.teaches = \["Canva", "Python"]

B.learns  = \["C"]



=> Mutual Match

```



The system should also be able to identify partial/one-way relevance.



Normalize skill comparison so:



```text

"JavaScript"

"javascript"

" JavaScript "

```



can be treated consistently.



\---



\# 25. DEMO INTERACTION



The entire frontend should be demonstrable without a backend.



A reviewer should be able to:



1\. Open the application.

2\. Create/edit a profile.

3\. Add skills they teach.

4\. Add skills they want to learn.

5\. Open Discover.

6\. Search/filter people.

7\. See mutual matches.

8\. Open a profile.

9\. Understand why the match exists.

10\. Open a conversation.

11\. Send messages.

12\. Refresh the browser.

13\. See the local data preserved.



This flow must work end-to-end.



\---



\# 26. QUALITY REQUIREMENTS



Use strict TypeScript.



Do NOT use:



```ts

any

```



unless absolutely unavoidable.



Do NOT use:



```ts

@ts-ignore

@ts-nocheck

```



Do not leave TODO placeholders for core functionality.



Avoid:



\* duplicated components

\* giant components

\* business logic inside presentation components

\* hardcoded repeated data

\* magic strings

\* inaccessible controls

\* unnecessary dependencies



Keep components small and composable.



\---



\# 27. CODE QUALITY



The project must maintain:



\* TypeScript strict mode

\* ESLint with zero warnings

\* clean component architecture

\* reusable utilities

\* clear naming

\* predictable state management

\* separation of UI and business logic

\* testable matching logic

\* maintainable CSS



If SonarQube configuration exists, make the implementation Sonar-friendly.



Avoid common code smells:



\* duplicated logic

\* deeply nested conditions

\* huge functions

\* unnecessary complexity

\* dead code

\* unused imports

\* duplicated constants



\---



\# 28. TESTING



Write tests for the most important business behavior.



Especially test:



\### Matching



\* mutual match

\* one-way match

\* no match

\* multiple matched skills

\* case-insensitive skill matching

\* whitespace normalization



\### Search



\* name search

\* skill search

\* location filtering

\* combined filtering

\* empty results



\### Local storage



\* save

\* load

\* missing data

\* invalid stored data



\### Messaging



\* sending a message

\* conversation persistence

\* message ordering



Use the testing framework already present in the project where possible.



\---



\# 29. IMPORTANT UX PRINCIPLE



Do not simply reproduce the original C-program menu as web pages.



The original C project contains concepts such as:



\* Register Student

\* Add / Update Skills

\* Search for a Skill

\* Find Skill Exchange

\* View All Students

\* Search Student



These concepts should be transformed into a modern web experience:



```text

Register Student

&#x20;       ↓

Profile / Onboarding



Add / Update Skills

&#x20;       ↓

Profile Editor



Search for a Skill

&#x20;       ↓

Discovery / Search



Find Skill Exchange

&#x20;       ↓

Matches



View All Students

&#x20;       ↓

Discover



Search Student

&#x20;       ↓

Global/Profile Search

```



The original academic project is the \*\*functional foundation\*\*, while this implementation should be a \*\*modern web product\*\*.



\---



\# 30. FUTURE-READY ARCHITECTURE



The original project identifies future expansion such as:



\* login

\* ratings

\* notifications

\* database

\* web/mobile

\* smart skill recommendations



Do NOT implement backend versions of these now.



However, structure the frontend so these can be added later without rewriting the application.



For example:



```text

Current:

localStorage



Future:

API repository

```



Keep data access abstract enough that the local implementation can eventually be replaced by an API.



\---



\# 31. DEVELOPMENT PROCESS



Work in these phases.



\## Phase 1 — Discovery



Inspect the repository and establish:



\* existing architecture

\* dependencies

\* routes

\* design system

\* available assets



Then create a screen/component/data-flow map.



\## Phase 2 — Foundation



Build:



\* application shell

\* routing

\* design tokens

\* navigation

\* reusable UI components

\* local storage layer

\* mock data



\## Phase 3 — Core Product



Build:



\* onboarding/profile

\* profile editing

\* skills management

\* discovery

\* search/filter

\* matching engine

\* matches page



\## Phase 4 — Communication



Build:



\* conversations

\* chat window

\* message history

\* send message

\* local persistence



\## Phase 5 — Polish



Add:



\* animations

\* responsive behavior

\* empty states

\* loading states

\* error states

\* accessibility

\* hover/focus states

\* visual polish



\## Phase 6 — Quality



Run:



\* TypeScript

\* ESLint

\* tests

\* build

\* production build verification



Fix all errors and warnings.



\---



\# 32. FINAL ACCEPTANCE CRITERIA



The final application should feel like a real product rather than a classroom CRUD interface.



A user should immediately understand:



> "I can teach something, I can learn something, and Skill Swap helps me find someone who wants exactly that exchange."



The strongest experience should be:



\*\*Discover → Match → Understand the Match → Connect → Chat\*\*



The application must be:



\* web-only

\* responsive

\* modern

\* polished

\* accessible

\* interactive

\* locally persistent

\* frontend-only

\* strongly typed

\* modular

\* testable

\* production-quality



Do not stop after creating static screens.



Implement the actual frontend interactions and local data flow so the application can be fully demonstrated without a backend.



Start by inspecting the repository and then implement the application systematically.



