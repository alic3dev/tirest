import type { JSXOutput } from '@builder.io/qwik'
import type { Tirest, Size } from 'tirest/types'

import {
  $,
  component$,
  useOnWindow,
  useSignal,
  useVisibleTask$,
} from '@builder.io/qwik'
import { Link } from '@builder.io/qwik-city'

import { drawBlock } from 'tirest/draw'
import { colorPalettes } from 'tirest/colorPalettes'

import styles from './hero.module.scss'

const CANVAS_RESOLUTION: Size = {
  width: 2560,
  height: 1440,
}

const _fieldSize: Size = {
  width: 40,
  height: 20,
}

export const Hero = component$((): JSXOutput => {
  const canvasRef = useSignal<HTMLCanvasElement>()

  const canvasResolution = useSignal<Size>(CANVAS_RESOLUTION)
  const fieldSize = useSignal<Size>(_fieldSize)

  const setCanvasResolution = $(
    (ctx: CanvasRenderingContext2D | null): void => {
      if (window.innerHeight < window.innerWidth) {
        if (canvasResolution.value.width === CANVAS_RESOLUTION.width) return

        canvasResolution.value = {
          width: CANVAS_RESOLUTION.width,
          height: CANVAS_RESOLUTION.height,
        }

        fieldSize.value = {
          width: _fieldSize.width,
          height: _fieldSize.height,
        }
      } else {
        if (canvasResolution.value.width === CANVAS_RESOLUTION.height) return

        canvasResolution.value = {
          width: CANVAS_RESOLUTION.height,
          height: CANVAS_RESOLUTION.width,
        }

        fieldSize.value = {
          width: _fieldSize.height,
          height: _fieldSize.width,
        }
      }

      if (!canvasRef.value) return

      if (!ctx) {
        ctx = canvasRef.value.getContext('2d', { willReadFrequently: true })

        if (!ctx) return
      }

      ctx.canvas.width = canvasResolution.value.width
      ctx.canvas.height = canvasResolution.value.height

      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    },
  )

  useOnWindow(
    'resize',
    $(() => setCanvasResolution(null)),
  )

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(
    ({ track, cleanup }): void => {
      track(canvasRef)

      if (!canvasRef.value) return

      const ctx: CanvasRenderingContext2D | null = canvasRef.value.getContext(
        '2d',
        { willReadFrequently: true },
      )

      if (!ctx) return

      setCanvasResolution(ctx)

      let animationFrameHandle: number
      let prevTime: number = 0
      let prevTimeEarly: number = 0

      const animationFrame = (time: DOMHighResTimeStamp): void => {
        const elapsedTime: number = time - prevTime
        const elapsedTimeEarly: number = time - prevTimeEarly

        // TODO: Drop pattern instead

        const prevStateImageData: ImageData = ctx.getImageData(
          0,
          0,
          ctx.canvas.width,
          ctx.canvas.height,
          { colorSpace: 'srgb' },
        )

        for (let i: number = 0; i < prevStateImageData.data.length; i++) {
          if ((i + 1) % 4 === 0) {
            prevStateImageData.data[i] = Math.floor(
              prevStateImageData.data[i] * (1 - elapsedTimeEarly / 1000),
            )
          }
        }

        prevTimeEarly = time

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        ctx.putImageData(prevStateImageData, 0, 0)

        if (prevTime !== 0 && elapsedTime < 10) {
          animationFrameHandle = requestAnimationFrame(animationFrame)
          return
        }

        const blockSize: number = ctx.canvas.width / fieldSize.value.width
        const fieldLength: number =
          fieldSize.value.width * fieldSize.value.height

        for (let i: number = 0; i < fieldLength; i++) {
          const xVal = i % fieldSize.value.width

          if ((xVal > 10 && xVal < 30) || Math.random() > 0.0001) continue

          drawBlock(
            ctx,
            { settings: { selectedColorPalette: colorPalettes[0] } } as Tirest,
            Math.floor(Math.random() * 5 + 1),
            {
              x: blockSize * xVal,
              y:
                blockSize *
                Math.floor((ctx.canvas.height / blockSize) * Math.random()),
            },
            { width: blockSize, height: blockSize },
          )
        }

        prevTime = time
        animationFrameHandle = requestAnimationFrame(animationFrame)
      }
      animationFrameHandle = requestAnimationFrame(animationFrame)

      cleanup((): void => {
        cancelAnimationFrame(animationFrameHandle)
      })
    },
    { strategy: 'document-ready' },
  )

  return (
    <div class={['container', styles.hero]}>
      <canvas
        ref={canvasRef}
        height={canvasResolution.value.height}
        width={canvasResolution.value.width}
        class={styles.canvas}
      ></canvas>

      <h1>
        So <span class="highlight">amazing</span>
        <br />
        to have <span class="highlight">you</span> here
      </h1>

      <p>Tired.. Tirest.. Tertis.. Tet.. ris?</p>

      <p>Have fun.</p>
      <div class={styles['button-group']}>
        <Link href="/play" class="button">
          Play now
        </Link>
      </div>
    </div>
  )
})
