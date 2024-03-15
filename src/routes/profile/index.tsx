import type { DefaultSession, Session } from '@auth/core/types'
import type {
  RequestEventLoader,
  DocumentHead,
  RequestHandler,
} from '@builder.io/qwik-city'
import type { JSXOutput, Signal } from '@builder.io/qwik'

import type { Score, ScoreError } from '~/components/profile/profile'

import { component$ } from '@builder.io/qwik'
import { routeLoader$ } from '@builder.io/qwik-city'

import { createKysely } from '@vercel/postgres-kysely'

import { useAuthSession } from '~/routes/plugin@auth'
import { Profile } from '~/components/profile'

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

export const useLastTenScores = routeLoader$(
  async (
    requestEvent: RequestEventLoader<QwikCityPlatform>,
  ): Promise<Score[] | ScoreError> => {
    const session: (Session & { uuid: string }) | undefined =
      requestEvent.sharedMap.get('session')

    if (!session) return []

    let res

    try {
      // throw new Error()
      const db = createKysely<Database.Alic3Dev>()
      res = await db
        .selectFrom('tirest_scores')
        .select(['game_id', 'level', 'score', 'submitted_timestamp'])
        .where('user_uuid', '=', session.uuid)
        .limit(10)
        .execute()
    } catch {
      return requestEvent.fail(500, {
        errorMessage: 'Whoops, something went wrong. :(',
      })
    }

    return res
  },
)

export default component$((): JSXOutput => {
  const session: Readonly<Signal<Session | null>> = useAuthSession()

  const user: Partial<Required<DefaultSession>['user']> =
    session.value?.user ?? {}

  const lastTenScores = useLastTenScores().value

  return <Profile user={user} scores={lastTenScores} />
})

export const head: DocumentHead = {
  title: 'Tirest - Profile',
  meta: [
    {
      name: 'description',
      content: 'Tired.. Tirest.. Tertis.. Tet.. ris?',
    },
  ],
}
