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
  tirestinoQueueId: UUID

  currentTirestinoId: number | null
  heldTirestinoId: number | null

  droppingFrom: Position

  inputDelay: number

  prevTime: DOMHighResTimeStamp
  prevInputTime: DOMHighResTimeStamp
  prevAutoFallTime: DOMHighResTimeStamp

  hasManuallyDropped: boolean
  hasRotated: boolean
  hasHeld: boolean
  hasEscaped: boolean
  hasSelected: boolean

  gameState: GameState

  selectedPauseMenuItem: number | null
}

export interface Tirestino {
  readonly id: number

  readonly rotateLeftId: number
  readonly rotateRightId: number

  readonly size: Readonly<Size>

  readonly data: Uint8Array
}

type MenuItemType = 'Actionable' | 'Expandable' | 'Numeric' | 'List' | 'String'

interface BaseMenuItem {
  title: string
  type: MenuItemType
}

export interface MenuItemActionable extends BaseMenuItem {
  type: 'Actionable'
  onClick: (tirest: Tirest) => void
}

export interface MenuItemExpandable extends BaseMenuItem {
  type: 'Expandable'
  items: MenuItem[]
}

export interface MenuItemWithNumericValue extends BaseMenuItem {
  type: 'Numeric'
  getMin(tirest: Tirest): number | null
  getMax(tirest: Tirest): number | null
  getValue(tirest: Tirest): number
  onDecrement(tirest: Tirest): void
  onIncrement(tirest: Tirest): void
}

export interface MenuItemWithListValue extends BaseMenuItem {
  type: 'List'
  getMin(tirest: Tirest): number | null
  getMax(tirest: Tirest): number | null
  getValue(tirest: Tirest): number
  onDecrement(tirest: Tirest): void
  onIncrement(tirest: Tirest): void
}

export interface MenuItemWithStringValue extends BaseMenuItem {
  type: 'String'
  value: string
}

export type MenuItem =
  | MenuItemActionable
  | MenuItemExpandable
  | MenuItemWithNumericValue
  | MenuItemWithListValue
  | MenuItemWithStringValue
