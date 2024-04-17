import type { Tirest, Size } from 'tirest/types'

import type { Signal } from '@builder.io/qwik'
import {
  $,
  component$,
  useOnDocument,
  useSignal,
  useStore,
  useVisibleTask$,
} from '@builder.io/qwik'

import { useAuthSession } from '~/routes/plugin@auth'

import * as tirestUtils from 'tirest'

import styles from './game.module.scss'
import type { Session } from '@auth/core/types'

const CANVAS_RESOLUTION: Size = {
  width: 1440,
  height: 1920,
}

export const Game = component$(() => {
  const session: Readonly<Signal<Session | null>> = useAuthSession()

  const tirest = useSignal<Tirest>()
  const canvasRef = useSignal<HTMLCanvasElement>()
  const keysPressed = useStore<Record<string, boolean>>({})

  useOnDocument(
    'keydown',
    $((event: KeyboardEvent): void => {
      keysPressed[event.code] = true
    }),
  )

  useOnDocument(
    'keyup',
    $((event: KeyboardEvent): void => {
      keysPressed[event.code] = false
    }),
  )

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ track, cleanup }) => {
    track(canvasRef)

    if (!canvasRef.value) return

    const ctx: CanvasRenderingContext2D | null =
      canvasRef.value.getContext('2d')
    if (!ctx) return

    if (!tirest.value) tirest.value = tirestUtils.getNew()

    const onGameOver = (): void => {
      if (session.value) {
        tirestUtils.network.postScore(tirest.value!)
      }
    }

    tirestUtils.on(tirest.value, 'GAME_OVER', onGameOver)

    let animationFrameHandle: number

    const animationFrame = (time: DOMHighResTimeStamp): void => {
      tirestUtils.poll(time, tirest.value!, keysPressed)
      tirestUtils.draw(tirest.value!, ctx)

      animationFrameHandle = window.requestAnimationFrame(animationFrame)
    }
    animationFrameHandle = window.requestAnimationFrame(animationFrame)

    cleanup((): void => {
      window.cancelAnimationFrame(animationFrameHandle)

      tirestUtils.close(tirest.value!)
    })
  })

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_RESOLUTION.width}
      height={CANVAS_RESOLUTION.height}
      class={styles.game}
    >
      You need to enable canvas and javascript X(
    </canvas>
  )
})
