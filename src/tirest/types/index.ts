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

export interface ColorPalette {
  name: string
  blocks: [string, string][]
}

export interface Level {
  number: number

  linesToClear: number
}

export interface ProgressInfo {
  clearedLines: number
  score: number
}

export interface Progress {
  totals: ProgressInfo
  byLevel: ProgressInfo[]
}

export interface Settings {
  musicVolume: number

  inputDelay: number

  selectedColorPalette: ColorPalette
}

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
  getMin(tirest: Tirest): string | null
  getMax(tirest: Tirest): string | null
  getValue(tirest: Tirest): string
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
