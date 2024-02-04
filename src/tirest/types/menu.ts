import type { Tirest } from './tirest'

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
