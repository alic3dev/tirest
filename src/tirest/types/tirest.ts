import type { UUID } from 'crypto'

import type { Position } from 'tirest/types/utils'
import type { Level } from 'tirest/types/level'
import type { Progress } from 'tirest/types/progress'
import type { Settings } from 'tirest/types/settings'

export type GameState = 'Playing' | 'Paused' | 'GameOver'

export interface Tirest {
  score: number

  fieldId: UUID
  tirestinoQueueId: UUID

  currentTirestinoId: number | null
  heldTirestinoId: number | null

  droppingFrom: Position

  prevTime: DOMHighResTimeStamp
  prevInputTime: DOMHighResTimeStamp
  prevAutoFallTime: DOMHighResTimeStamp

  hasManuallyDropped: boolean
  hasRotated: boolean
  hasHeld: boolean
  hasEscaped: boolean
  hasSelected: boolean

  gameState: GameState

  selectedMenuItem: number | null

  combo: number

  level: Level

  progress: Progress

  settings: Settings
}
