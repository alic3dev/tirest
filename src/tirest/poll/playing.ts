import type { Tirest, Tirestino, Position } from '../types'

import { lookupTirestino } from '../tirestino'
import { generateNewTirestinoQueue, lookupTirestinoQueue } from '../queues'
import { lookupField } from '../fields'
import { fieldSize, AUTO_FALL_MS } from '../constants'

function checkBounds(
  tirest: Tirest,
  tirestino: Tirestino,
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

export function pollPlaying(
  time: DOMHighResTimeStamp,
  tirest: Tirest,
  keysPressed: Record<string, boolean>,
): void {
  if (keysPressed.Escape) {
    if (!tirest.hasEscaped) {
      tirest.gameState = 'Paused'
      tirest.hasEscaped = true
      return
    }
  } else {
    tirest.hasEscaped = false
  }

  if (tirest.currentTirestinoId === null) {
    const tirestinoQueue: Tirestino[] = lookupTirestinoQueue(tirest)
    tirest.currentTirestinoId = tirestinoQueue.pop()!.id

    if (!tirestinoQueue.length) {
      tirest.tirestinoQueueId = generateNewTirestinoQueue()
    }
  }

  const field: Uint8Array = lookupField(tirest)

  const elapsedInputTime: number = time - tirest.prevInputTime

  let tirestino: Tirestino = lookupTirestino(tirest.currentTirestinoId)

  if (!keysPressed.ShiftLeft) tirest.hasHeld = false
  if (!keysPressed.Space) {
    tirest.hasManuallyDropped = false
    tirest.hasSelected = false
  }
  if (!keysPressed.ArrowUp && !keysPressed.KeyZ) tirest.hasRotated = false

  let hasDropped: boolean = false

  if (keysPressed.Space && !tirest.hasManuallyDropped && !tirest.hasSelected) {
    tirest.hasManuallyDropped = true
    let dropToY: number = tirest.droppingFrom.y

    for (
      let i = 1;
      i < fieldSize.height - tirestino.size.height - tirest.droppingFrom.y + 1;
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

    const tirestinoQueue: Tirestino[] = lookupTirestinoQueue(tirest)
    tirest.currentTirestinoId = tirestinoQueue.pop()!.id

    if (!tirestinoQueue.length) {
      tirest.tirestinoQueueId = generateNewTirestinoQueue()
    }

    tirest.droppingFrom = {
      x: Math.floor(fieldSize.width / 2),
      y: 0,
    }

    hasDropped = true
  } else if (keysPressed.ShiftLeft && !tirest.hasHeld) {
    tirest.prevAutoFallTime = time
    tirest.prevInputTime = time

    tirest.hasHeld = true

    const previouslyHeldTirestinoId: number | null = tirest.heldTirestinoId

    tirest.heldTirestinoId = tirest.currentTirestinoId

    if (previouslyHeldTirestinoId !== null) {
      tirest.currentTirestinoId = previouslyHeldTirestinoId
    } else {
      const tirestinoQueue: Tirestino[] = lookupTirestinoQueue(tirest)
      tirest.currentTirestinoId = tirestinoQueue.pop()!.id

      if (!tirestinoQueue.length) {
        tirest.tirestinoQueueId = generateNewTirestinoQueue()
      }
    }

    tirest.droppingFrom = {
      x: Math.floor(fieldSize.width / 2),
      y: 0,
    }
  } else if (
    (keysPressed.ArrowUp || keysPressed.KeyZ) &&
    !tirest.hasRotated &&
    typeof tirestino.rotateLeftId !== 'undefined' &&
    typeof tirestino.rotateRightId !== 'undefined'
  ) {
    const rotatedTirestino: Tirestino = lookupTirestino(
      keysPressed.ArrowUp ? tirestino.rotateRightId : tirestino.rotateLeftId,
    )

    if (!checkBounds(tirest, rotatedTirestino, field)) {
      tirestino = rotatedTirestino
      tirest.currentTirestinoId = tirestino.id
    }

    tirest.hasRotated = true
  } else if (
    elapsedInputTime > tirest.inputDelay &&
    (keysPressed.ArrowLeft !== keysPressed.ArrowRight ||
      keysPressed.Space ||
      keysPressed.ShiftLeft)
  ) {
    if (keysPressed.ArrowLeft) {
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

  if (hasDropped) {
    for (let y: number = fieldSize.height - 1; y >= 0; y--) {
      let shouldClear: boolean = true

      for (let x: number = 0; x < fieldSize.width; x++) {
        if (!field[fieldSize.width * y + x]) {
          shouldClear = false
          break
        }
      }

      if (shouldClear) {
        for (let yy: number = y; yy >= 0; yy--) {
          for (let x: number = 0; x < fieldSize.width; x++) {
            field[fieldSize.width * yy + x] =
              yy === 0 ? 0 : field[fieldSize.width * (yy - 1) + x]
          }
        }

        y++
      }
    }
  }
}
