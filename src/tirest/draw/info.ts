import type { Position, Tirest } from 'tirest/types'

import { fieldSize } from 'tirest/constants'

export function drawInfo(ctx: CanvasRenderingContext2D, tirest: Tirest): void {
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
    `${tirest.progress.totals.score}`,
    holdingWindowPosition.x + holdingWindowSize / 2,
    holdingWindowPosition.y + holdingWindowSize + textSize * 10,
  )

  ctx.fillText(
    `Level`,
    holdingWindowPosition.x + holdingWindowSize / 2,
    holdingWindowPosition.y + holdingWindowSize + textSize * 14,
  )

  ctx.fillText(
    `${tirest.level.number}`,
    holdingWindowPosition.x + holdingWindowSize / 2,
    holdingWindowPosition.y + holdingWindowSize + textSize * 16,
  )

  ctx.fillText(
    `Lines to clear`,
    holdingWindowPosition.x + holdingWindowSize / 2,
    holdingWindowPosition.y + holdingWindowSize + textSize * 20,
  )

  ctx.fillText(
    `${tirest.level.linesToClear - tirest.progress.byLevel[tirest.progress.byLevel.length - 1].clearedLines}`,
    holdingWindowPosition.x + holdingWindowSize / 2,
    holdingWindowPosition.y + holdingWindowSize + textSize * 22,
  )
}
