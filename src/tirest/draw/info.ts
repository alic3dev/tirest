import type { Position } from '../types'

import { fieldSize } from '../constants'

export function drawScore(ctx: CanvasRenderingContext2D, score: number): void {
  const holdingWindowSize: number = ctx.canvas.width * 0.25
  const textSize: number = 36

  const holdingWindowPosition: Position = {
    x: ctx.canvas.width - ctx.canvas.width * 0.05 - holdingWindowSize,
    y:
      ctx.canvas.height -
      ctx.canvas.width * 0.6 * (fieldSize.height / fieldSize.width) -
      ctx.canvas.width * 0.05 +
      textSize * 4 +
      holdingWindowSize,
  }

  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  ctx.font = `bold ${textSize}px ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont`

  ctx.fillStyle = '#FFFFFFAA'
  ctx.fillText(
    `Score`,
    holdingWindowPosition.x + holdingWindowSize / 2,
    holdingWindowPosition.y + holdingWindowSize + textSize * 8,
  )

  ctx.fillText(
    `${score}`,
    holdingWindowPosition.x + holdingWindowSize / 2,
    holdingWindowPosition.y + holdingWindowSize + textSize * 10,
  )
}
