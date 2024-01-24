import { component$ } from '@builder.io/qwik'
import styles from './header.module.css'

export default component$(() => {
  return (
    <header class={styles.header}>
      <div class={['container', styles.wrapper]}>
        <h3>Tirest</h3>
        <ul>
          <li>Leaderboards</li>
          <li>Login</li>
          <li>Register</li>
        </ul>
      </div>
    </header>
  )
})
