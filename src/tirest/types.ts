import type { UUID } from 'crypto'

export interface Position {
  x: number
  y: number
}

export interface Size {
  width: number
  height: number
}

export type GameState = 'Playing' | 'Paused' | 'GameOver'

export interface Tirest {
  score: number
  fieldId: UUID
  currentTirestinoId: number | null
  droppingFrom: Position
  prevTime: DOMHighResTimeStamp
  prevInputTime: DOMHighResTimeStamp
  prevAutoFallTime: DOMHighResTimeStamp
  hasManuallyDropped: boolean
  hasRotated: boolean
  tirestinoQueueId: UUID
  heldTirestinoId: number | null
  hasHeld: boolean
  gameState: GameState
}

export interface Tirestino {
  readonly id: number
  readonly rotateLeftId: number
  readonly rotateRightId: number
  readonly size: {
    readonly height: number
    readonly width: number
  }
  readonly data: Uint8Array
}
