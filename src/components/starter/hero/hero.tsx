import { component$ } from '@builder.io/qwik'
import { Link } from '@builder.io/qwik-city'

import styles from './hero.module.css'

export default component$(() => {
  return (
    <div class={['container', styles.hero]}>
      <h1>
        So <span class="highlight">amazing</span>
        <br />
        to have <span class="highlight">you</span> here
      </h1>
      <p>Have fun.</p>
      <div class={styles['button-group']}>
        <Link href="/play" class="button">
          Play now
        </Link>
      </div>
    </div>
  )
})
