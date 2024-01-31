import type { Session } from '@auth/core/types'
import type { DocumentHead, RequestHandler } from '@builder.io/qwik-city'
import type { JSXOutput } from '@builder.io/qwik'

import { component$ } from '@builder.io/qwik'

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

export default component$((): JSXOutput => <></>)

export const head: DocumentHead = {
  title: 'Tirest - Profile',
  meta: [
    {
      name: 'description',
      content: 'Tired.. Tirest.. Tertis.. Tet.. ris?',
    },
  ],
}
