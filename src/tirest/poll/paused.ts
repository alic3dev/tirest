import type { Tirest, MenuItem } from 'tirest/types'

import { pauseMenu } from 'tirest/pauseMenu'
import { PAUSE_MENU_INPUT_DELAY_MS } from 'tirest/constants'

export function pollPaused(
  time: DOMHighResTimeStamp,
  tirest: Tirest,
  keysPressed: Record<string, boolean>,
): void {
  if (tirest.selectedMenuItem === null) {
    tirest.selectedMenuItem = 0
  }

  if (keysPressed.Escape) {
    if (!tirest.hasEscaped) {
      tirest.selectedMenuItem = null
      tirest.gameState = 'Playing'
      tirest.hasEscaped = true
      return
    }
  } else {
    tirest.hasEscaped = false
  }

  const elapsedInputTime: number = time - tirest.prevInputTime

  if (!keysPressed.Enter && !keysPressed.Space) tirest.hasSelected = false

  const menuItem: MenuItem = pauseMenu[tirest.selectedMenuItem]

  if (!tirest.hasSelected && (keysPressed.Enter || keysPressed.Space)) {
    if (menuItem.type === 'Actionable') {
      menuItem.onClick(tirest)
    }

    tirest.hasSelected = true
  } else if (
    elapsedInputTime > PAUSE_MENU_INPUT_DELAY_MS &&
    (!!keysPressed.ArrowUp !== !!keysPressed.ArrowDown) !==
      (!!keysPressed.ArrowLeft !== !!keysPressed.ArrowRight)
  ) {
    if (!!keysPressed.ArrowUp !== !!keysPressed.ArrowDown) {
      tirest.selectedMenuItem = Math.max(
        Math.min(
          tirest.selectedMenuItem +
            (keysPressed.ArrowUp ? -1 : keysPressed.ArrowDown ? 1 : 0),
          pauseMenu.length - 1,
        ),
        0,
      )
    } else if (!!keysPressed.ArrowLeft && !keysPressed.ArrowRight) {
      if (menuItem.type === 'Numeric' || menuItem.type === 'List')
        menuItem.onDecrement(tirest)
    } else if (!keysPressed.ArrowLeft && !!keysPressed.ArrowRight) {
      if (menuItem.type === 'Numeric' || menuItem.type === 'List')
        menuItem.onIncrement(tirest)
    }

    tirest.prevInputTime = time
  }
}
