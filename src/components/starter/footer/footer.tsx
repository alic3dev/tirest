import type { JSXOutput } from '@builder.io/qwik'

import { component$ } from '@builder.io/qwik'

import styles from './footer.module.scss'

export default component$((): JSXOutput => {
  return (
    <footer>
      <div class="container">
        <span class={styles.anchor}>
          <span>
            ♡ from <a href="https://alic3.dev">Alic3</a>
          </span>
        </span>
      </div>
    </footer>
  )
})
