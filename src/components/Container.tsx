import type { JSXOutput } from '@builder.io/qwik'
import { component$, Slot } from '@builder.io/qwik'

import styles from './Container.module.scss'

export const Container = component$((): JSXOutput => {
  return (
    <div class={styles.container}>
      <Slot />
    </div>
  )
})
