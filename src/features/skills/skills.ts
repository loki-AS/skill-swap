import { ALL_SKILLS, CATEGORY_NAMES, SKILL_CATEGORIES, type SkillCategory } from '../../data/skills'

/** Canonical comparison key: trims, collapses inner whitespace, lowercases. "  Java  Script " → "java script". */
export function normalizeSkill(skill: string): string {
  return skill.trim().replace(/\s+/g, ' ').toLowerCase()
}

const canonicalByKey = new Map(ALL_SKILLS.map((s) => [normalizeSkill(s), s]))
const categoryByKey = new Map<string, SkillCategory>(
  CATEGORY_NAMES.flatMap((cat) => SKILL_CATEGORIES[cat].map((s) => [normalizeSkill(s), cat] as const)),
)

/** Maps input onto catalog casing when it's a known skill ("react" → "React"); otherwise tidies whitespace. */
export function canonicalSkill(skill: string): string {
  return canonicalByKey.get(normalizeSkill(skill)) ?? skill.trim().replace(/\s+/g, ' ')
}

export function getSkillCategory(skill: string): SkillCategory {
  return categoryByKey.get(normalizeSkill(skill)) ?? 'Other'
}

export function includesSkill(list: readonly string[], skill: string): boolean {
  const key = normalizeSkill(skill)
  return list.some((s) => normalizeSkill(s) === key)
}
