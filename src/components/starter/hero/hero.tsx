import type { UUID } from 'crypto'
import type { JSXOutput } from '@builder.io/qwik'
import type { Tirest, Size } from '~/tirest/types'

import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik'
import { Link } from '@builder.io/qwik-city'

import { drawBlock } from '~/tirest/draw'
import { colorPalettes } from '~/tirest/colorPalettes'
import { generateNewField, lookupField } from '~/tirest/fields'

import styles from './hero.module.scss'

const CANVAS_RESOLUTION: Size = {
  width: 2560,
  height: 1440,
}

const _fieldSize: Size = {
  width: 40,
  height: 20,
}

export default component$((): JSXOutput => {
  const canvasRef = useSignal<HTMLCanvasElement>()
  const fieldId = useSignal<UUID>()

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(
    ({ track, cleanup }): void => {
      track(canvasRef)

      if (!fieldId.value) {
        fieldId.value = generateNewField(_fieldSize)
      }

      if (!canvasRef.value) return

      const ctx: CanvasRenderingContext2D | null = canvasRef.value.getContext(
        '2d',
        { willReadFrequently: true },
      )

      if (!ctx) return

      let animationFrameHandle: number
      let prevTime: number = 0
      let prevTimeEarly: number = 0

      const animationFrame = (time: DOMHighResTimeStamp): void => {
        const field: Uint8Array = lookupField({
          fieldId: fieldId.value,
        } as Tirest)
        const elapsedTime: number = time - prevTime
        const elapsedTimeEarly: number = time - prevTimeEarly

        // TODO: Drop pattern instead

        const prevStateImageData = ctx.getImageData(
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

        const blockSize = ctx.canvas.width / _fieldSize.width

        const heightOffset = ctx.canvas.height - blockSize * _fieldSize.height

        for (let i: number = 0; i < field.length; i++) {
          const xVal = i % _fieldSize.width

          if ((xVal > 10 && xVal < 30) || Math.random() > 0.0001) continue

          drawBlock(
            ctx,
            { settings: { selectedColorPalette: colorPalettes[0] } } as Tirest,
            Math.floor(Math.random() * 5 + 1),
            {
              x: blockSize * xVal,
              y: heightOffset + blockSize * Math.floor(i / _fieldSize.width),
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
        height={CANVAS_RESOLUTION.height}
        width={CANVAS_RESOLUTION.width}
        class={styles.canvas}
      ></canvas>

      <h1>
        So <span class="highlight">amazing</span>
        <br />
        to have <span class="highlight">you</span> here
      </h1>

      {/* <p>Tired.. Tirest.. Tertis.. Tet.. ris?</p> */}

      <p>Have fun.</p>
      <div class={styles['button-group']}>
        <Link href="/play" class="button">
          Play now
        </Link>
      </div>
    </div>
  )
})
