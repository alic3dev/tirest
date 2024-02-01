import type { Tirest, MenuItem } from '../types'

import { pauseMenu } from '../pauseMenu'
import { PAUSE_MENU_INPUT_DELAY_MS } from '../constants'

export function pollPaused(
  time: DOMHighResTimeStamp,
  tirest: Tirest,
  keysPressed: Record<string, boolean>,
): void {
  if (tirest.selectedPauseMenuItem === null) {
    tirest.selectedPauseMenuItem = 0
  }

  if (keysPressed.Escape) {
    if (!tirest.hasEscaped) {
      tirest.selectedPauseMenuItem = null
      tirest.gameState = 'Playing'
      tirest.hasEscaped = true
      return
    }
  } else {
    tirest.hasEscaped = false
  }

  const elapsedInputTime: number = time - tirest.prevInputTime

  if (!keysPressed.Enter && !keysPressed.Space) tirest.hasSelected = false

  const menuItem: MenuItem = pauseMenu[tirest.selectedPauseMenuItem]

  if (!tirest.hasSelected && (keysPressed.Enter || keysPressed.Space)) {
    if (menuItem.type === 'Actionable') {
      menuItem.onClick(tirest)
    }

    tirest.hasSelected = true
  } else if (
    elapsedInputTime > PAUSE_MENU_INPUT_DELAY_MS &&
    (keysPressed.ArrowUp !== keysPressed.ArrowDown) !==
      (keysPressed.ArrowLeft !== keysPressed.ArrowRight)
  ) {
    if (keysPressed.ArrowUp !== keysPressed.ArrowDown) {
      tirest.selectedPauseMenuItem = Math.max(
        Math.min(
          tirest.selectedPauseMenuItem +
            (keysPressed.ArrowUp ? -1 : keysPressed.ArrowDown ? 1 : 0),
          pauseMenu.length - 1,
        ),
        0,
      )
    } else if (keysPressed.ArrowLeft && !keysPressed.ArrowRight) {
      if (menuItem.type === 'Numeric') menuItem.onDecrement(tirest)
    } else if (!keysPressed.ArrowLeft && keysPressed.ArrowRight) {
      if (menuItem.type === 'Numeric') menuItem.onIncrement(tirest)
    }

    tirest.prevInputTime = time
  }
}
