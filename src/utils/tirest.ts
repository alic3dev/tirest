import type { UUID } from 'crypto'

import * as tirestinos from './tirestino'

const defaultTirestinos: tirestinos.Tirestino[] = [
  tirestinos.iBlock,
  tirestinos.lBlock,
  tirestinos.oBlock,
  tirestinos.rBlock,
  tirestinos.sBlock,
  tirestinos.tBlock,
  tirestinos.zBlock,
].sort(
  (a: tirestinos.Tirestino, b: tirestinos.Tirestino): number => a.id - b.id,
)

function lookupTirestino(id: number): tirestinos.Tirestino {
  return defaultTirestinos[id]
}

const INPUT_DELAY_MS: number = 45
const AUTO_FALL_MS: number = 1000

interface Position {
  x: number
  y: number
}

export interface Tirest {
  score: number
  fieldId: UUID
  currentTirestinoId: number
  droppingFrom: Position
  prevTime: DOMHighResTimeStamp
  prevInputTime: DOMHighResTimeStamp
  prevAutoFallTime: DOMHighResTimeStamp
  hasManuallyDropped: boolean
}

const fieldSize: { width: number; height: number } = {
  width: 10,
  height: 20,
}

const fieldLookup: Record<UUID, Uint8Array> = {}

function generateNewField(): UUID {
  const fieldId: UUID = crypto.randomUUID()
  fieldLookup[fieldId] = new Uint8Array(fieldSize.width * fieldSize.height)

  return fieldId
}

function lookupField(tirest: Tirest): Uint8Array {
  let field: Uint8Array | undefined = fieldLookup[tirest.fieldId]

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!field) {
    tirest.fieldId = generateNewField() // FIXME: SSR issues - this shouldn't be neccesary
    field = fieldLookup[tirest.fieldId]

    // field[fieldSize.width * 19 + 3] = 1
    // field[fieldSize.width * 19 + 4] = 1
    // field[fieldSize.width * 19 + 5] = 1
    // field[fieldSize.width * 18 + 4] = 1

    // field[fieldSize.width * 19 + 0] = 3
    // field[fieldSize.width * 19 + 1] = 3
    // field[fieldSize.width * 18 + 0] = 3
    // field[fieldSize.width * 17 + 0] = 3

    // field[fieldSize.width * 17 + 3] = 2
    // field[fieldSize.width * 17 + 4] = 2
    // field[fieldSize.width * 16 + 3] = 2
    // field[fieldSize.width * 16 + 4] = 2
  }

  return field
}

export function getNew(): Tirest {
  return {
    score: 0,
    fieldId: generateNewField(),
    currentTirestinoId: Math.floor(Math.random() * defaultTirestinos.length),
    droppingFrom: { x: Math.round(fieldSize.width / 2), y: 0 },
    prevTime: 0,
    prevInputTime: -INPUT_DELAY_MS,
    prevAutoFallTime: 0,
    hasManuallyDropped: false,
  }
}

function checkBounds(
  tirest: Tirest,
  tirestino: tirestinos.Tirestino,
  field: Uint8Array,
  offset: Partial<Position> = { x: 0, y: 0 },
): boolean {
  for (let i: number = 0; i < tirestino.data.length; i++) {
    if (
      tirestino.data[i] &&
      field[
        fieldSize.width *
          (tirest.droppingFrom.y +
            Math.floor(i / tirestino.size.width) +
            (offset.y ?? 0)) +
          tirest.droppingFrom.x +
          (i % tirestino.size.width) +
          (offset.x ?? 0)
      ]
    ) {
      return true
    }
  }

  return false
}

export function poll(
  time: DOMHighResTimeStamp,
  tirest: Tirest,
  keysPressed: Record<string, boolean>,
): void {
  const field: Uint8Array = lookupField(tirest)

  const elapsedInputTime: number = time - tirest.prevInputTime

  const tirestino: tirestinos.Tirestino = lookupTirestino(
    tirest.currentTirestinoId,
  )

  if (!keysPressed.Space) tirest.hasManuallyDropped = false

  if (
    elapsedInputTime > INPUT_DELAY_MS &&
    (keysPressed.ArrowLeft !== keysPressed.ArrowRight || keysPressed.Space)
  ) {
    if (keysPressed.Space && !tirest.hasManuallyDropped) {
      tirest.hasManuallyDropped = true
      let dropToY: number = tirest.droppingFrom.y

      for (
        let i = 1;
        i <
        fieldSize.height - tirestino.size.height - tirest.droppingFrom.y + 1;
        i++
      ) {
        if (checkBounds(tirest, tirestino, field, { y: i })) {
          break
        }

        dropToY++
      }

      for (let i = 0; i < tirestino.data.length; i++) {
        if (!tirestino.data[i]) continue

        field[
          fieldSize.width * (dropToY + Math.floor(i / tirestino.size.width)) +
            tirest.droppingFrom.x +
            (i % tirestino.size.width)
        ] = tirestino.data[i]
      }

      tirest.currentTirestinoId = Math.floor(
        Math.random() * defaultTirestinos.length,
      )
      tirest.droppingFrom = {
        x: Math.floor(fieldSize.width / 2),
        y: 0,
      }
    } else if (keysPressed.ArrowLeft) {
      const boundingX: number = tirest.droppingFrom.x - 1
      const wouldOverlap: boolean =
        boundingX < 0 || checkBounds(tirest, tirestino, field, { x: -1 })

      if (!wouldOverlap) {
        tirest.droppingFrom.x = tirest.droppingFrom.x - 1
      }
    } else if (keysPressed.ArrowRight) {
      const boundingX: number = tirest.droppingFrom.x + 1
      const wouldOverlap: boolean =
        boundingX > fieldSize.width - tirestino.size.width ||
        checkBounds(tirest, tirestino, field, { x: 1 })

      if (!wouldOverlap) {
        tirest.droppingFrom.x = tirest.droppingFrom.x + 1
      }
    }

    tirest.prevInputTime = time
  }

  if (
    time - tirest.prevAutoFallTime >
    AUTO_FALL_MS - (keysPressed.ArrowDown ? AUTO_FALL_MS / 1.1 : 0)
  ) {
    const boundingY: number = tirest.droppingFrom.y + tirestino.size.height

    const wouldOverlap: boolean =
      boundingY > fieldSize.height - 1 ||
      checkBounds(tirest, tirestino, field, { y: 1 })

    if (!wouldOverlap) tirest.droppingFrom.y = tirest.droppingFrom.y + 1

    tirest.prevAutoFallTime = time
  }

  tirest.prevTime = time
}

function _drawField(
  tirest: Tirest,
  field: Uint8Array,
  ctx: CanvasRenderingContext2D,
): void {
  const fieldCanvasSize = {
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

  const _drawBlock = (data: number, position: Position): void => {
    switch (data) {
      case 1:
        ctx.fillStyle = '#0FF'
        ctx.strokeStyle = '#099'
        break
      case 2:
        ctx.fillStyle = '#FF0'
        ctx.strokeStyle = '#990'
        break
      case 3:
        ctx.fillStyle = '#0F0'
        ctx.strokeStyle = '#090'
        break
      case 4:
        ctx.fillStyle = '#F00'
        ctx.strokeStyle = '#090'
        break
      case 5:
        ctx.fillStyle = '#AF0'
        ctx.strokeStyle = '#090'
        break
      case 6:
        ctx.fillStyle = '#0FA'
        ctx.strokeStyle = '#090'
        break
      case 7:
        ctx.fillStyle = '#AA0'
        ctx.strokeStyle = '#090'
        break
      default:
        ctx.fillStyle = '#FFFFFF'
        ctx.strokeStyle = '#999999'
    }

    ctx.beginPath()
    ctx.rect(
      fieldPosition.x + blockSize.width * position.x,
      fieldPosition.y + blockSize.height * position.y,
      blockSize.width,
      blockSize.height,
    )
    ctx.fill()
    ctx.stroke()
  }

  for (let i: number = 0; i < field.length; i++) {
    if (!field[i]) continue

    _drawBlock(field[i], {
      x: i % fieldSize.width,
      y: Math.floor(i / fieldSize.width),
    })
  }

  const tirestino: tirestinos.Tirestino =
    defaultTirestinos[tirest.currentTirestinoId]

  for (let i: number = 0; i < tirestino.data.length; i++) {
    if (!tirestino.data[i]) continue

    _drawBlock(tirestino.data[i], {
      x: tirest.droppingFrom.x + (i % tirestino.size.width),
      y: tirest.droppingFrom.y + Math.floor(i / tirestino.size.width),
    })
  }

  ctx.lineWidth = prevLineWidth
}

function _drawPreviewWindow(
  _blockToDraw: undefined,
  ctx: CanvasRenderingContext2D,
): void {
  _blockToDraw

  const previewWindowSize: number = ctx.canvas.width * 0.25

  ctx.fillStyle = '#00000010'
  ctx.strokeStyle = '#000000'

  ctx.beginPath()
  ctx.rect(
    ctx.canvas.width - ctx.canvas.width * 0.05 - previewWindowSize,
    ctx.canvas.height -
      ctx.canvas.width * 0.6 * (fieldSize.height / fieldSize.width) -
      ctx.canvas.width * 0.05,
    previewWindowSize,
    previewWindowSize,
  )
  ctx.stroke()
  ctx.fill()
}

export function draw(tirest: Tirest, ctx: CanvasRenderingContext2D): void {
  const field: Uint8Array = lookupField(tirest)

  ctx.reset()
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

  ctx.fillStyle = '#00000006'
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

  ctx.strokeStyle = '#000000'
  ctx.strokeRect(0, 0, ctx.canvas.width, ctx.canvas.height)

  _drawField(tirest, field, ctx)
  _drawPreviewWindow(undefined, ctx)

  // ctx.textAlign = 'right'
  // ctx.textBaseline = 'bottom'
  // ctx.font =
  //   'bold 36px ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont'
  // ctx.fillText(`Score: ${tirest.score}`, ctx.canvas.width, ctx.canvas.height)
}
