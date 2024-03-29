import type { Tirest, MenuItem } from 'tirest/types'

import { gameOverMenu } from 'tirest/gameOverMenu'
import { PAUSE_MENU_INPUT_DELAY_MS } from 'tirest/constants'

export function pollGameOver(
  time: DOMHighResTimeStamp,
  tirest: Tirest,
  keysPressed: Record<string, boolean>,
): void {
  if (tirest.selectedMenuItem === null) {
    tirest.selectedMenuItem = 0
  }

  const elapsedInputTime: number = time - tirest.prevInputTime

  if (!keysPressed.Enter && !keysPressed.Space) {
    tirest.hasSelected = false
  }

  if (tirest.hasManuallyDropped && !keysPressed.Space) {
    tirest.hasManuallyDropped = false
  }

  const menuItem: MenuItem = gameOverMenu[tirest.selectedMenuItem]

  if (
    !tirest.hasManuallyDropped &&
    !tirest.hasSelected &&
    (keysPressed.Enter || keysPressed.Space)
  ) {
    if (menuItem.type === 'Actionable') {
      menuItem.onClick(tirest)
    }

    tirest.hasSelected = true
  } else if (
    elapsedInputTime > PAUSE_MENU_INPUT_DELAY_MS &&
    (!!keysPressed.ArrowUp !== !!keysPressed.ArrowDown) !==
      (!!keysPressed.ArrowLeft !== !!keysPressed.ArrowRight)
  ) {
    if (keysPressed.ArrowUp !== keysPressed.ArrowDown) {
      tirest.selectedMenuItem = Math.max(
        Math.min(
          tirest.selectedMenuItem +
            (keysPressed.ArrowUp ? -1 : keysPressed.ArrowDown ? 1 : 0),
          gameOverMenu.length - 1,
        ),
        0,
      )
    } else if (keysPressed.ArrowLeft && !keysPressed.ArrowRight) {
      if (menuItem.type === 'Numeric' || menuItem.type === 'List')
        menuItem.onDecrement(tirest)
    } else if (!keysPressed.ArrowLeft && keysPressed.ArrowRight) {
      if (menuItem.type === 'Numeric' || menuItem.type === 'List')
        menuItem.onIncrement(tirest)
    }

    tirest.prevInputTime = time
  }
}
