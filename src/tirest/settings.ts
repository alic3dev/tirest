import type { Settings, Tirest } from './types'

const LOCAL_STORAGE_SETTINGS_KEY: string = 'tirest:settings'

export function save(tirest: Tirest): void {
  window.localStorage.setItem(
    LOCAL_STORAGE_SETTINGS_KEY,
    JSON.stringify(tirest.settings),
  )
}

export function load(): Partial<Settings> {
  const savedSettings = window.localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY)

  if (!savedSettings) return {}

  try {
    const parsedSettings: Partial<Settings> = JSON.parse(savedSettings)

    if (typeof parsedSettings === 'object') {
      return parsedSettings
    }
  } catch {
    /* empty */
  }

  return {}
}
