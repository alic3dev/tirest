import type { Tirest, Tirestino } from './types'

import { fieldSize, INPUT_DELAY_MS } from './constants'
import { lookupTirestino } from './tirestino'
import { generateNewTirestinoQueue, lookupTirestinoQueue } from './queues'
import { generateNewField, lookupField } from './fields'

import _draw from './draw'
import _poll from './poll'

export function getNew(): Tirest {
  return {
    score: 0,
    fieldId: generateNewField(),
    currentTirestinoId: null,
    droppingFrom: { x: Math.round(fieldSize.width / 2), y: 0 },
    prevTime: 0,
    prevInputTime: -INPUT_DELAY_MS,
    prevAutoFallTime: 0,
    hasManuallyDropped: false,
    hasRotated: false,
    tirestinoQueueId: generateNewTirestinoQueue(),
    heldTirestinoId: null,
    hasHeld: false,
    gameState: 'Playing',
  }
}

export function poll(
  time: DOMHighResTimeStamp,
  tirest: Tirest,
  keysPressed: Record<string, boolean>,
): void {
  switch (tirest.gameState) {
    case 'Playing':
      _poll.playing(time, tirest, keysPressed)
      break
    default:
      throw new Error(`Unknown game state: ${tirest.gameState}`)
  }
}

export function draw(tirest: Tirest, ctx: CanvasRenderingContext2D): void {
  const field: Uint8Array = lookupField(tirest)

  ctx.reset()
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

  ctx.fillStyle = '#00000006'
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

  ctx.strokeStyle = '#000000'
  ctx.strokeRect(0, 0, ctx.canvas.width, ctx.canvas.height)

  const tirestinoQueue: Tirestino[] = lookupTirestinoQueue(tirest)

  _draw.field(tirest, field, ctx)
  _draw.previewWindow(tirestinoQueue[tirestinoQueue.length - 1], ctx)
  _draw.holdingWindow(
    tirest.heldTirestinoId !== null
      ? lookupTirestino(tirest.heldTirestinoId)
      : null,
    ctx,
  )
  _draw.score(tirest.score, ctx)
}
