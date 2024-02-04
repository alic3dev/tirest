import type { Tirest, Settings } from './types'

import { generateNewField } from './fields'
import { generateNewTirestinoQueue } from './queues'
import { fieldSize, INPUT_DELAY_MS } from './constants'
import { standard } from './colorPalettes'

import * as settings from './settings'

export function generateNewTirest(): Tirest {
  const savedSettings: Partial<Settings> = settings.load()

  return {
    score: 0,

    fieldId: generateNewField(),
    tirestinoQueueId: generateNewTirestinoQueue(),

    currentTirestinoId: null,
    heldTirestinoId: null,

    droppingFrom: { x: Math.round(fieldSize.width / 2), y: 0 },

    prevTime: 0,
    prevInputTime: -INPUT_DELAY_MS,
    prevAutoFallTime: 0,

    hasHeld: false,
    hasManuallyDropped: false,
    hasRotated: false,
    hasEscaped: false,
    hasSelected: false,

    gameState: 'Playing',


    combo: 1,

    level: {
      number: 1,
      linesToClear: 10,
    },

    progress: {
      totals: {
        clearedLines: 0,
        score: 0,
      },

      byLevel: [
        {
          clearedLines: 0,
          score: 0,
        },
      ],
    },

    settings: {
      musicVolume: 0,

      inputDelay: INPUT_DELAY_MS,

      selectedColorPalette: standard,

      ...savedSettings,
    },
  }
}
