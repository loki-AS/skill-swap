export const SKILL_CATEGORIES = {
  Programming: ['C Programming', 'Python', 'JavaScript', 'TypeScript', 'React', 'Java', 'SQL', 'Data Structures', 'Git & GitHub'],
  Design: ['Canva', 'Figma', 'Photoshop', 'Illustrator', 'UI Design'],
  'Photo & Video': ['Photography', 'Lightroom', 'Video Editing', 'Premiere Pro'],
  Music: ['Guitar', 'Piano', 'Singing', 'Music Production'],
  Marketing: ['SEO', 'Social Media Marketing', 'Copywriting', 'Content Strategy'],
  Communication: ['Public Speaking', 'Interview Prep', 'Debate', 'Technical Writing'],
  Languages: ['Spanish', 'French', 'German', 'Japanese', 'Hindi', 'Kannada', 'English Speaking'],
  Academics: ['Calculus', 'Statistics', 'Physics', 'Chemistry', 'Economics'],
  Productivity: ['Excel', 'Google Sheets', 'Notion', 'Time Management'],
  Creative: ['Drawing', 'Calligraphy', 'Creative Writing'],
} as const satisfies Record<string, readonly string[]>

export type SkillCategory = keyof typeof SKILL_CATEGORIES | 'Other'

export const CATEGORY_NAMES = Object.keys(SKILL_CATEGORIES) as (keyof typeof SKILL_CATEGORIES)[]

export const ALL_SKILLS: readonly string[] = Object.values(SKILL_CATEGORIES).flat()

export const MAX_SKILLS_PER_LIST = 12
export const MAX_SKILL_LENGTH = 40

export const LOCATIONS = ['Bengaluru', 'Mumbai', 'Pune', 'Delhi', 'Hyderabad', 'Chennai', 'Kolkata', 'Remote'] as const
