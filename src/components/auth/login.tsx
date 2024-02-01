import type { JSXOutput } from '@builder.io/qwik'
import { component$ } from '@builder.io/qwik'

import { useAuthSignin } from '~/routes/plugin@auth'

import { Container } from '../Container'

import styles from './login.module.scss'

export const Login = component$<{ registering?: boolean }>(
  ({ registering = false }): JSXOutput => {
    const signIn = useAuthSignin()

    return (
      <Container>
        <h3 class={styles.title}>{registering ? 'Register' : 'Sign in'}</h3>

        <hr class={styles.hr} />

        <button
          class={`${styles['login-button']} ${styles['apple']} button-small`}
          onClick$={() =>
            signIn.submit({
              providerId: 'apple',
              options: {
                callbackUrl: 'http://localhost:5173/api/auth/callback/apple',
              },
            })
          }
        >
          <img
            loading="lazy"
            height="24"
            width="24"
            id="provider-logo"
            src="https://authjs.dev/img/providers/apple.svg"
          />
          Sign {registering ? 'up' : 'in'} with Apple
        </button>

        <button
          class={`${styles['login-button']} ${styles['google']} button-small`}
          onClick$={() =>
            signIn.submit({
              providerId: 'google',
              options: {
                callbackUrl: 'http://localhost:5173/api/auth/callback/google',
              },
            })
          }
        >
          <img
            loading="lazy"
            height="24"
            width="24"
            id="provider-logo"
            src="https://authjs.dev/img/providers/google.svg"
          />
          Sign {registering ? 'up' : 'in'} with Google
        </button>
      </Container>
    )
  },
)
