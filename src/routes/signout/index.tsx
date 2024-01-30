import type { JSXOutput } from '@builder.io/qwik'
import type { DocumentHead, RequestHandler } from '@builder.io/qwik-city'
import type { Session } from '@auth/core/types'

import { component$ } from '@builder.io/qwik'

import styles from './index.module.scss'
import { useAuthSignout } from '../plugin@auth'
import { Container } from '~/components/Container'

export const onRequest: RequestHandler = async ({
  next,
  sharedMap,
  redirect,
}): Promise<void> => {
  const session: Session = sharedMap.get('session')

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!session) {
    throw redirect(302, '/')
  }

  await next()
}

export default component$((): JSXOutput => {
  const signOut = useAuthSignout()

  return (
    <div class={styles.signout}>
      <Container>
        <h4>Are you sure you wish to sign out?</h4>

        <hr />

        <div class={styles.buttons}>
          <button
            class="button-small"
            preventdefault:click
            onClick$={(): void => {
              window.location.href = '/'
            }}
          >
            Cancel
          </button>

          <button
            class="button-small button-danger"
            preventdefault:click
            onClick$={(): void => {
              signOut.submit({ callbackUrl: '/' })
            }}
          >
            Sign out
          </button>
        </div>
      </Container>
    </div>
  )
})

export const head: DocumentHead = {
  title: 'Tirest - Signin',
}
