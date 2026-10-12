/**
 * The only module that touches localStorage. Keys are namespaced and versioned;
 * bumping STORAGE_VERSION makes old data unreadable and purgeStaleVersions() removes it.
 */
const NAMESPACE = 'skillswap'
export const STORAGE_VERSION = 1

const keyFor = (key: string) => `${NAMESPACE}:v${STORAGE_VERSION}:${key}`

export type ReadResult<T> = { status: 'ok'; value: T } | { status: 'missing' | 'invalid'; value: null }

export function readItem<T>(key: string, isValid: (value: unknown) => value is T): ReadResult<T> {
  let raw: string | null
  try {
    raw = localStorage.getItem(keyFor(key))
  } catch {
    return { status: 'missing', value: null }
  }
  if (raw === null) return { status: 'missing', value: null }
  try {
    const parsed: unknown = JSON.parse(raw)
    if (isValid(parsed)) return { status: 'ok', value: parsed }
  } catch {
    // fall through: corrupted JSON is treated like invalid shape
  }
  removeItem(key)
  return { status: 'invalid', value: null }
}

/** Returns false when the write fails (quota exceeded, storage disabled) so callers can tell the user. */
export function writeItem(key: string, value: unknown): boolean {
  try {
    localStorage.setItem(keyFor(key), JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

export function removeItem(key: string): void {
  try {
    localStorage.removeItem(keyFor(key))
  } catch {
    // storage unavailable: nothing to remove
  }
}

function namespacedKeys(): string[] {
  try {
    return Object.keys(localStorage).filter((k) => k.startsWith(`${NAMESPACE}:`))
  } catch {
    return []
  }
}

/** Drops keys written by older schema versions. */
export function purgeStaleVersions(): void {
  const current = `${NAMESPACE}:v${STORAGE_VERSION}:`
  namespacedKeys()
    .filter((k) => !k.startsWith(current))
    .forEach((k) => localStorage.removeItem(k))
}

export function clearAll(): void {
  namespacedKeys().forEach((k) => localStorage.removeItem(k))
}
