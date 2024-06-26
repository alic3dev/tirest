import type {
  EventName,
  GameState,
  MenuItem,
  Position,
  Tirest,
  Tirestino,
} from 'tirest/types'

import { generateNewTirest } from 'tirest/tirest'
import { lookupTirestino } from 'tirest/tirestino'
import { lookupTirestinoQueue } from 'tirest/queues'
import { lookupField } from 'tirest/fields'
import { pauseMenu } from 'tirest/pauseMenu'
import { gameOverMenu } from 'tirest/gameOverMenu'
import { addEvents, removeEvents, clearEvents } from 'tirest/events'

import _draw from 'tirest/draw'
import _poll from 'tirest/poll'

import * as audio from 'tirest/audio'

const menuLookup: Partial<Record<GameState, MenuItem[]>> = {
  Paused: pauseMenu,
  GameOver: gameOverMenu,
}

export * as network from 'tirest/network'

export function getNew(): Tirest {
  return generateNewTirest()
}

export function on(tirest: Tirest, eventName: EventName, callback: () => void) {
  addEvents(tirest, {
    [eventName]: [callback],
  })
}

export function off(
  tirest: Tirest,
  eventName: EventName,
  callback: () => void,
) {
  removeEvents(tirest, {
    [eventName]: [callback],
  })
}

export function poll(
  time: DOMHighResTimeStamp,
  tirest: Tirest,
  keysPressed: Record<string, boolean>,
): void {
  const currentGameState: GameState = tirest.gameState

  audio.start(tirest)

  switch (currentGameState) {
    case 'Playing':
      _poll.playing(time, tirest, keysPressed)
      break
    case 'Paused':
      _poll.paused(time, tirest, keysPressed)
      break
    case 'GameOver':
      _poll.gameOver(time, tirest, keysPressed)
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
  _draw.info(ctx, tirest)

  if (tirest.gameState === 'Paused' || tirest.gameState === 'GameOver') {
    const currentMenu: MenuItem[] = menuLookup[tirest.gameState]!

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
    ctx.fillText(
      tirest.gameState.toUpperCase(),
      pausedPosition.x,
      pausedPosition.y,
    )

    const textSize: number = 48

    const menuItemPosition: Position = {
      x: ctx.canvas.width / 6,
      y: pausedPosition.y + titleTextSize * 2 + textSize,
    }

    for (let i = 0; i < currentMenu.length; i++) {
      ctx.font = `bold ${textSize}px ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont`

      const menuItemPositionOffset: Position = {
        x: 0,
        y: textSize * 2 * i,
      }

      ctx.fillStyle = '#FFFFFF'

      if (tirest.selectedMenuItem === i) {
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

      const menuItem: MenuItem = currentMenu[i]

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
  } else {
    tirest.selectedMenuItem = null
  }
}

export function close(tirest: Tirest) {
  audio.stop()
  clearEvents(tirest)
}
