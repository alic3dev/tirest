import type { Tirest, Tirestino, Position, Size } from '../types'

import { fieldSize } from '../constants'
import { drawBlock } from './block'

export function drawHoldingWindow(
  ctx: CanvasRenderingContext2D,
  tirest: Tirest,
  blockToDraw: Tirestino | null,
): void {
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

  ctx.fillStyle = '#00000010'
  ctx.strokeStyle = '#000000'

  ctx.beginPath()
  ctx.rect(
    holdingWindowPosition.x,
    holdingWindowPosition.y,
    holdingWindowSize,
    holdingWindowSize,
  )
  ctx.stroke()
  ctx.fill()

  const blockSize: Size = {
    width: holdingWindowSize / 5,
    height: holdingWindowSize / 5,
  }

  if (blockToDraw) {
    for (let i: number = 0; i < blockToDraw.data.length; i++) {
      if (!blockToDraw.data[i]) continue

      drawBlock(
        ctx,
        tirest,
        blockToDraw.data[i],
        {
          x:
            holdingWindowPosition.x +
            holdingWindowSize / 2 -
            (blockSize.width * blockToDraw.size.width) / 2 +
            blockSize.width * (i % blockToDraw.size.width),
          y:
            holdingWindowPosition.y +
            holdingWindowSize / 2 -
            (blockSize.height * blockToDraw.size.height) / 2 +
            blockSize.height * Math.floor(i / blockToDraw.size.width),
        },
        blockSize,
      )
    }
  }

  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  ctx.font = `bold ${textSize}px ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont`

  ctx.fillStyle = '#FFFFFFAA'
  ctx.fillText(
    `Held`,
    holdingWindowPosition.x + holdingWindowSize / 2,
    holdingWindowPosition.y + holdingWindowSize + textSize / 2,
  )
}
