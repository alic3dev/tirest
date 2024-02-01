import type { JSXOutput } from '@builder.io/qwik'

import { component$ } from '@builder.io/qwik'

import styles from './next-steps.module.scss'

export default component$((): JSXOutput => {
  return (
    <div class="container container-purple container-center">
      <h2>
        Well think of something
        <br />
        <span class="highlight">right</span>?
      </h2>
      <div class={styles.gettingstarted}>
        <div class={styles.intro}>Hmm</div>

        <button class="button-dark">:)</button>
      </div>
    </div>
  )
})
