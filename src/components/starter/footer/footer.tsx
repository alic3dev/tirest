import { component$ } from '@builder.io/qwik'
import styles from './footer.module.css'

export default component$(() => {
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
