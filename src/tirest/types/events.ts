import type { UUID } from 'crypto'

export type EventName = 'GAME_OVER'

export type Events =
  | Partial<{
      [key in EventName]: (() => void)[] | undefined
    }>
  | undefined

export type EventLookup = Record<UUID, Events>
