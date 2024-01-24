import {
  $,
  component$,
  useOnDocument,
  useSignal,
  useStore,
  useVisibleTask$,
} from '@builder.io/qwik'
import * as tirestUtils from '~/utils/tirest'

import styles from './game.module.scss'

interface Size {
  width: number
  height: number
}

const CANVAS_RESOLUTION: Size = {
  width: 1440,
  height: 1920,
}

export const Game = component$(() => {
  const tirest = useSignal<tirestUtils.Tirest>(tirestUtils.getNew())
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
    track(tirest)

    if (!canvasRef.value) return

    const ctx: CanvasRenderingContext2D | null =
      canvasRef.value.getContext('2d')
    if (!ctx) return

    let animationFrameHandle: number

    const animationFrame = (time: DOMHighResTimeStamp): void => {
      tirestUtils.poll(time, tirest.value, keysPressed)
      tirestUtils.draw(tirest.value, ctx)

      animationFrameHandle = window.requestAnimationFrame(animationFrame)
    }
    animationFrameHandle = window.requestAnimationFrame(animationFrame)

    cleanup((): void => window.cancelAnimationFrame(animationFrameHandle))
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
