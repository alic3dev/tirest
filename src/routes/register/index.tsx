import type { JSXOutput } from '@builder.io/qwik'
import type { DocumentHead, RequestHandler } from '@builder.io/qwik-city'
import type { Session } from '@auth/core/types'

import { component$ } from '@builder.io/qwik'

import { Login } from '~/components/auth/login'

import styles from './index.module.scss'

export const onRequest: RequestHandler = async ({
  next,
  sharedMap,
  redirect,
}): Promise<void> => {
  const session: Session = sharedMap.get('session')

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (session) {
    throw redirect(302, '/')
  }

  await next()
}

export default component$((): JSXOutput => {
  return (
    <div class={styles.register}>
      <Login registering />
    </div>
  )
})

export const head: DocumentHead = {
  title: 'Tirest - Register',
}
