import type { Tirest, MenuItem } from './types'

import { generateNewTirest } from './tirest'

export const pauseMenu: MenuItem[] = [
  {
    title: 'Resume (ESC)',
    type: 'Actionable',
    onClick: (tirest: Tirest): void => {
      tirest.gameState = 'Playing'
    },
  },
  {
    title: 'Key bindings',
    type: 'Expandable',
    items: [],
  },
  {
    title: 'Input delay',
    type: 'Numeric',
    getMin() {
      return 0
    },
    getMax() {
      return null
    },
    getValue(tirest: Tirest): number {
      return tirest.inputDelay
    },
    onIncrement(tirest: Tirest): void {
      tirest.inputDelay++
    },
    onDecrement(tirest: Tirest): void {
      tirest.inputDelay = Math.max(tirest.inputDelay - 1, 0)
    },
  },
  {
    title: 'Restart',
    type: 'Actionable',
    onClick: (tirest: Tirest): void => {
      const newTirest: Tirest = generateNewTirest()

      for (const key in newTirest) {
        tirest[key] = newTirest[key]
      }
    },
  },
]
