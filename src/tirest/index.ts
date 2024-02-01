import type { GameState, MenuItem, Position, Tirest, Tirestino } from './types'

import { generateNewTirest } from './tirest'
import { lookupTirestino } from './tirestino'
import { lookupTirestinoQueue } from './queues'
import { lookupField } from './fields'
import { pauseMenu } from './pauseMenu'

import _draw from './draw'
import _poll from './poll'

export function getNew(): Tirest {
  return generateNewTirest()
}

export function poll(
  time: DOMHighResTimeStamp,
  tirest: Tirest,
  keysPressed: Record<string, boolean>,
): void {
  const currentGameState: GameState = tirest.gameState

  switch (currentGameState) {
    case 'Playing':
      _poll.playing(time, tirest, keysPressed)
      break
    case 'Paused':
      _poll.paused(time, tirest, keysPressed)
      break
    case 'GameOver':
      break
    default:
      throw new Error(`Unknown game state: ${currentGameState}`)
  }

  if (currentGameState !== tirest.gameState) {
    return poll(time, tirest, keysPressed)
  } else {
    tirest.prevTime = time
  }
}

export function draw(tirest: Tirest, ctx: CanvasRenderingContext2D): void {
  const field: Uint8Array = lookupField(tirest)
  const tirestinoQueue: Tirestino[] = lookupTirestinoQueue(tirest)

  _draw.clear(ctx)
  _draw.field(ctx, tirest, field)
  _draw.previewWindow(ctx, tirest, tirestinoQueue[tirestinoQueue.length - 1])
  _draw.holdingWindow(
    ctx,
    tirest,
    tirest.heldTirestinoId !== null
      ? lookupTirestino(tirest.heldTirestinoId)
      : null,
  )
  _draw.score(ctx, tirest.score)

  if (tirest.gameState === 'Paused') {
    ctx.fillStyle = '#00000033'
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    const titleTextSize: number = 100
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    ctx.font = `bold ${titleTextSize}px ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont`

    const pausedPosition: Position = {
      x: ctx.canvas.width / 2,
      y: titleTextSize,
    }

    ctx.fillStyle = '#FFFFFFFF'
    ctx.fillText(`PAUSED`, pausedPosition.x, pausedPosition.y)

    const textSize: number = 48

    const menuItemPosition: Position = {
      x: ctx.canvas.width / 6,
      y: pausedPosition.y + titleTextSize * 2 + textSize,
    }

    for (let i = 0; i < pauseMenu.length; i++) {
      ctx.font = `bold ${textSize}px ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont`

      const menuItemPositionOffset: Position = {
        x: 0,
        y: textSize * 2 * i,
      }

      ctx.fillStyle = '#FFFFFF'

      if (tirest.selectedPauseMenuItem === i) {
        ctx.textAlign = 'right'

        const arrowWidth: number = ctx.measureText('->').width

        ctx.fillText(
          '->',
          menuItemPosition.x + menuItemPositionOffset.x - arrowWidth / 2,
          menuItemPosition.y + menuItemPositionOffset.y,
        )
      } else {
        ctx.fillStyle = '#FFFFFF66'
      }

      const menuItem: MenuItem = pauseMenu[i]

      switch (menuItem.type) {
        case 'List':
        case 'Numeric':
          const menuItemTitleWidth: number = ctx.measureText(
            menuItem.title,
          ).width

          const menuItemValue: number | string = menuItem.getValue(tirest)

          if (menuItemValue !== menuItem.getMin(tirest)) {
            ctx.textAlign = 'left'

            ctx.fillText(
              '<',
              menuItemPosition.x +
                menuItemPositionOffset.x +
                menuItemTitleWidth +
                50,
              menuItemPosition.y + menuItemPositionOffset.y,
            )
          }

          if (menuItemValue !== menuItem.getMax(tirest)) {
            ctx.textAlign = 'right'
            ctx.fillText(
              '>',
              menuItemPosition.x +
                menuItemPositionOffset.x +
                menuItemTitleWidth +
                350,
              menuItemPosition.y + menuItemPositionOffset.y,
            )
          }

          ctx.textAlign = 'center'
          ctx.fillText(
            `${menuItemValue}`,
            menuItemPosition.x +
              menuItemPositionOffset.x +
              menuItemTitleWidth +
              200,
            menuItemPosition.y + menuItemPositionOffset.y,
          )

          break
        case 'String':
          // TODO: Implement me
          break
        default:
          break
      }

      ctx.textAlign = 'left'

      ctx.fillText(
        menuItem.title,
        menuItemPosition.x + menuItemPositionOffset.x,
        menuItemPosition.y + menuItemPositionOffset.y,
      )
    }
  }
}
