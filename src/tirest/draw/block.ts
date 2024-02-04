import type { Position, Size, Tirest } from 'tirest/types'

export const drawBlock = (
  ctx: CanvasRenderingContext2D,
  tirest: Tirest,
  data: number,
  position: Position,
  blockSize: Size,
): void => {
  const [fillColor, strokeColor]: [string, string] = tirest.settings
    .selectedColorPalette.blocks[data - 1] ?? ['#FFFFFF', '#999999']

  ctx.fillStyle = fillColor
  ctx.strokeStyle = strokeColor

  ctx.beginPath()
  ctx.rect(position.x, position.y, blockSize.width, blockSize.height)
  ctx.fill()
  ctx.stroke()
}
