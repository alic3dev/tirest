import type { Tirest } from './types'

import { generateNewField } from './fields'
import { generateNewTirestinoQueue } from './queues'
import { fieldSize, INPUT_DELAY_MS } from './constants'

export function generateNewTirest(): Tirest {
  return {
    score: 0,

    fieldId: generateNewField(),
    tirestinoQueueId: generateNewTirestinoQueue(),

    currentTirestinoId: null,
    heldTirestinoId: null,

    droppingFrom: { x: Math.round(fieldSize.width / 2), y: 0 },

    inputDelay: INPUT_DELAY_MS,

    prevTime: 0,
    prevInputTime: -INPUT_DELAY_MS,
    prevAutoFallTime: 0,

    hasHeld: false,
    hasManuallyDropped: false,
    hasRotated: false,
    hasEscaped: false,
    hasSelected: false,

    gameState: 'Playing',

    selectedPauseMenuItem: null,
  }
}
