import type { Size, Tirest, Tirestino } from '../types'

import { fieldSize } from '../constants'
import { lookupTirestino } from '../tirestino'
import { drawBlock } from './block'

export function drawField(
  ctx: CanvasRenderingContext2D,
  tirest: Tirest,
  field: Uint8Array,
): void {
  const fieldCanvasSize: Size = {
    width: ctx.canvas.width * 0.6,
    height: ctx.canvas.width * 0.6 * (fieldSize.height / fieldSize.width),
  }

  const fieldPosition = {
    x: ctx.canvas.width * 0.05,
    y: ctx.canvas.height - fieldCanvasSize.height - ctx.canvas.width * 0.05,
  }

  ctx.canvas.width * 0.05

  ctx.fillStyle = '#00000010'
  ctx.strokeStyle = '#000000'

  ctx.beginPath()
  ctx.rect(
    fieldPosition.x,
    fieldPosition.y,
    fieldCanvasSize.width,
    fieldCanvasSize.height,
  )
  ctx.stroke()
  ctx.fill()

  const blockSize = {
    width: fieldCanvasSize.width / fieldSize.width,
    height: fieldCanvasSize.height / fieldSize.height,
  }

  const prevLineWidth: number = ctx.lineWidth
  ctx.lineWidth = 4

  for (let i: number = 0; i < field.length; i++) {
    if (!field[i]) continue

    drawBlock(
      ctx,
      tirest,
      field[i],
      {
        x: fieldPosition.x + blockSize.width * (i % fieldSize.width),
        y: fieldPosition.y + blockSize.height * Math.floor(i / fieldSize.width),
      },
      blockSize,
    )
  }

  const tirestino: Tirestino = lookupTirestino(tirest.currentTirestinoId!)

  for (let i: number = 0; i < tirestino.data.length; i++) {
    if (!tirestino.data[i]) continue

    drawBlock(
      ctx,
      tirest,
      tirestino.data[i],
      {
        x:
          fieldPosition.x +
          blockSize.width *
            (tirest.droppingFrom.x + (i % tirestino.size.width)),
        y:
          fieldPosition.y +
          blockSize.height *
            (tirest.droppingFrom.y + Math.floor(i / tirestino.size.width)),
      },
      blockSize,
    )
  }

  ctx.lineWidth = prevLineWidth
}
