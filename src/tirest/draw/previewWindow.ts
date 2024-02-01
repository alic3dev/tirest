import type { Tirestino, Position } from '../types'

import { fieldSize } from '../constants'
import { drawBlock } from './block'

export function drawPreviewWindow(
  blockToDraw: Tirestino,
  ctx: CanvasRenderingContext2D,
): void {
  const previewWindowSize: number = ctx.canvas.width * 0.25

  const previewWindowPosition: Position = {
    x: ctx.canvas.width - ctx.canvas.width * 0.05 - previewWindowSize,
    y:
      ctx.canvas.height -
      ctx.canvas.width * 0.6 * (fieldSize.height / fieldSize.width) -
      ctx.canvas.width * 0.05,
  }

  ctx.fillStyle = '#00000010'
  ctx.strokeStyle = '#000000'

  ctx.beginPath()
  ctx.rect(
    previewWindowPosition.x,
    previewWindowPosition.y,
    previewWindowSize,
    previewWindowSize,
  )
  ctx.stroke()
  ctx.fill()

  const blockSize = {
    width: previewWindowSize / 5,
    height: previewWindowSize / 5,
  }

  for (let i: number = 0; i < blockToDraw.data.length; i++) {
    if (!blockToDraw.data[i]) continue

    drawBlock(
      ctx,
      blockToDraw.data[i],
      {
        x:
          previewWindowPosition.x +
          previewWindowSize / 2 -
          (blockSize.width * blockToDraw.size.width) / 2 +
          blockSize.width * (i % blockToDraw.size.width),
        y:
          previewWindowPosition.y +
          previewWindowSize / 2 -
          (blockSize.height * blockToDraw.size.height) / 2 +
          blockSize.height * Math.floor(i / blockToDraw.size.width),
      },
      blockSize,
    )
  }

  const textSize: number = 36

  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  ctx.font = `bold ${textSize}px ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont`

  ctx.fillStyle = '#FFFFFFAA'
  ctx.fillText(
    `Up next`,
    previewWindowPosition.x + previewWindowSize / 2,
    previewWindowPosition.y + previewWindowSize + textSize / 2,
  )
}