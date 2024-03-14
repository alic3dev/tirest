import type { Tirest, Settings, Events } from 'tirest/types'

import { generateNewField } from 'tirest/fields'
import { generateNewTirestinoQueue } from 'tirest/queues'
import { fieldSize, INPUT_DELAY_MS } from 'tirest/constants'
import { standard } from 'tirest/colorPalettes'
import { addEvents, clearEvents } from 'tirest/events'
import * as settings from 'tirest/settings'

export function generateNewTirest(tirest?: Tirest): Tirest {
  const savedSettings: Partial<Settings> = settings.load()

  const newTirest: Tirest = {
    id: crypto.randomUUID(),

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

    selectedMenuItem: null,

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

  if (tirest) {
    const previousEvents: Events = clearEvents(tirest)
    addEvents(newTirest, previousEvents)
  }

  return newTirest
}
