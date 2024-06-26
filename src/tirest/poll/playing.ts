import type { Tirest, Tirestino, Position, ProgressInfo } from 'tirest/types'

import { lookupTirestino } from 'tirest/tirestino'
import { generateNewTirestinoQueue, lookupTirestinoQueue } from 'tirest/queues'
import { lookupField } from 'tirest/fields'
import { fieldSize, AUTO_FALL_MS } from 'tirest/constants'
import { triggerEvent } from '../events'

function checkBounds(
  tirest: Tirest,
  tirestino: Tirestino,
  field: Uint8Array,
  offset: Partial<Position> = { x: 0, y: 0 },
): boolean {
  const _offset: Position = {
    x: offset.x ?? 0,
    y: offset.y ?? 0,
  }

  if (
    tirestino.size.width + tirest.droppingFrom.x + _offset.x >
      fieldSize.width ||
    tirest.droppingFrom.x + _offset.x < 0
  ) {
    return true
  }

  if (
    tirestino.size.height + tirest.droppingFrom.y + _offset.y >
      fieldSize.height ||
    tirest.droppingFrom.y + _offset.y < 0
  ) {
    return true
  }

  for (let i: number = 0; i < tirestino.data.length; i++) {
    if (
      tirestino.data[i] &&
      field[
        fieldSize.width *
          (tirest.droppingFrom.y +
            Math.floor(i / tirestino.size.width) +
            _offset.y) +
          tirest.droppingFrom.x +
          (i % tirestino.size.width) +
          _offset.x
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
  let hasHeld: boolean = false

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

    tirestino = lookupTirestino(tirest.currentTirestinoId)

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

    tirestino = lookupTirestino(tirest.currentTirestinoId)

    hasHeld = true
  } else if (
    (keysPressed.ArrowUp || keysPressed.KeyZ) &&
    !tirest.hasRotated &&
    typeof tirestino.rotateLeftId !== 'undefined' &&
    typeof tirestino.rotateRightId !== 'undefined'
  ) {
    const rotatedTirestino: Tirestino = lookupTirestino(
      keysPressed.ArrowUp ? tirestino.rotateRightId : tirestino.rotateLeftId,
    )

    for (let i: number = 0; i < rotatedTirestino.size.width; i++) {
      if (!checkBounds(tirest, rotatedTirestino, field, { x: -i })) {
        tirestino = rotatedTirestino
        tirest.currentTirestinoId = tirestino.id
        tirest.droppingFrom.x = tirest.droppingFrom.x - i
        tirest.hasRotated = true

        break
      }
    }

    if (!tirest.hasRotated) {
      for (let i: number = 1; i < rotatedTirestino.size.width; i++) {
        if (!checkBounds(tirest, rotatedTirestino, field, { x: i })) {
          tirestino = rotatedTirestino
          tirest.currentTirestinoId = tirestino.id
          tirest.droppingFrom.x = tirest.droppingFrom.x + i
          tirest.hasRotated = true

          break
        }
      }
    }

    if (!tirest.hasRotated) {
      for (let i: number = 1; i < rotatedTirestino.size.height; i++) {
        if (!checkBounds(tirest, rotatedTirestino, field, { y: -i })) {
          tirestino = rotatedTirestino
          tirest.currentTirestinoId = tirestino.id
          tirest.droppingFrom.y = tirest.droppingFrom.y - i
          tirest.hasRotated = true

          break
        }
      }
    }

    tirest.hasRotated = true
  } else if (
    elapsedInputTime > tirest.settings.inputDelay &&
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

  const fallTime: number = AUTO_FALL_MS / tirest.level.speed

  // TODO: Force a drop after X time based on falltime & height/yPosition

  if (
    time - tirest.prevAutoFallTime >
    fallTime - (keysPressed.ArrowDown ? fallTime / 1.1 : 0)
  ) {
    const boundingY: number = tirest.droppingFrom.y + tirestino.size.height

    const wouldOverlap: boolean =
      boundingY > fieldSize.height - 1 ||
      checkBounds(tirest, tirestino, field, { y: 1 })

    if (!wouldOverlap) tirest.droppingFrom.y = tirest.droppingFrom.y + 1

    tirest.prevAutoFallTime = time
  }

  if (hasDropped) {
    let clearedLinesThisDrop: number = 0

    for (let y: number = fieldSize.height - 1; y >= 0; y--) {
      let shouldClear: boolean = true

      for (let x: number = 0; x < fieldSize.width; x++) {
        if (!field[fieldSize.width * y + x]) {
          shouldClear = false
          break
        }
      }

      if (shouldClear) {
        clearedLinesThisDrop++

        const currentLevelProgress: ProgressInfo =
          tirest.progress.byLevel[tirest.progress.byLevel.length - 1]
        currentLevelProgress.clearedLines++
        tirest.progress.totals.clearedLines++

        const earnedScore: number =
          clearedLinesThisDrop * tirest.combo * tirest.level.number * 100

        currentLevelProgress.score += earnedScore
        tirest.progress.totals.score += earnedScore

        if (currentLevelProgress.clearedLines >= tirest.level.linesToClear) {
          tirest.level = {
            number: tirest.level.number + 1,
            speed: tirest.level.speed * 1.35,
            linesToClear: Math.floor(tirest.level.linesToClear * 1.15),
          }

          tirest.progress.byLevel.push({
            clearedLines: 0,
            score: 0,
          })
        }

        for (let yy: number = y; yy >= 0; yy--) {
          for (let x: number = 0; x < fieldSize.width; x++) {
            field[fieldSize.width * yy + x] =
              yy === 0 ? 0 : field[fieldSize.width * (yy - 1) + x]
          }
        }

        y++
      }
    }

    if (clearedLinesThisDrop) {
      tirest.combo++
    } else {
      tirest.combo = 1
    }
  }

  if (hasHeld || hasDropped) {
    if (checkBounds(tirest, tirestino, field)) {
      tirest.gameState = 'GameOver'
      triggerEvent(tirest, 'GAME_OVER')
    }
  }
}
