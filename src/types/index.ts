export const AVAILABILITY_OPTIONS = ['Weekday evenings', 'Weekends', 'Flexible', 'Mornings'] as const
export type Availability = (typeof AVAILABILITY_OPTIONS)[number]

/** A person on Skill Swap. Mirrors the original Student record: ID, Name, profile info, Skills to Teach, Skills to Learn. */
export interface User {
  id: string
  name: string
  /** Data URL or image URL. Empty string falls back to generated initials. */
  avatar: string
  /** Department / role line, e.g. "CS undergrad · RV College". */
  headline: string
  bio: string
  location: string
  availability: Availability
  teaches: string[]
  learns: string[]
}

export interface Message {
  id: string
  conversationId: string
  senderId: string
  text: string
  createdAt: string
}

export interface Conversation {
  id: string
  participantIds: string[]
  messages: Message[]
  createdAt: string
  /** When the current user last read this conversation. Drives unread indicators. */
  lastReadAt: string
}

export const THEME_OPTIONS = ['system', 'light', 'dark'] as const
export type Theme = (typeof THEME_OPTIONS)[number]

export interface Preferences {
  theme: Theme
}

export type MatchKind = 'mutual' | 'they-teach' | 'you-teach' | 'none'

export interface MatchedSkills {
  /** Skills you teach that they want to learn. */
  youTeach: string[]
  /** Skills they teach that you want to learn. */
  theyTeach: string[]
}

export interface Match {
  user: User
  skills: MatchedSkills
  kind: MatchKind
  /** 0–100 compatibility score. */
  score: number
}
