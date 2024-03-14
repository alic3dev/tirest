import type { Tirest, MenuItem } from 'tirest/types'

import { generateNewTirest } from 'tirest/tirest'
import { settingsMenu } from 'tirest/settingsMenu'

export const pauseMenu: MenuItem[] = [
  {
    title: 'Resume (ESC)',
    type: 'Actionable',
    onClick: (tirest: Tirest): void => {
      tirest.gameState = 'Playing'
    },
  },
  ...settingsMenu,
  {
    title: 'Restart',
    type: 'Actionable',
    onClick: (tirest: Tirest): void => {
      const newTirest: Tirest = generateNewTirest(tirest)

      for (const key in newTirest) {
        // @ts-ignore: Tirest destructuring into Tirest
        tirest[key] = newTirest[key]
      }
    },
  },
]
