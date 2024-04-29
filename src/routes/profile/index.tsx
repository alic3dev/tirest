import type { DefaultSession, Session } from '@auth/core/types'
import type {
  RequestEventLoader,
  DocumentHead,
  RequestHandler,
} from '@builder.io/qwik-city'
import type { JSXOutput, Signal } from '@builder.io/qwik'

import type { Score, ScoreError } from '~/types'

import { component$, useSignal } from '@builder.io/qwik'
import { routeLoader$ } from '@builder.io/qwik-city'

import { createKysely } from '@vercel/postgres-kysely'

import { getDisplayName, useAuthSession } from '~/routes/plugin@auth'
import { Profile } from '~/components/profile/profile'
import { errors as errorMessages } from '~/utils/messages'

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

export const useScoreData = routeLoader$(
  async (
    requestEvent: RequestEventLoader<QwikCityPlatform>,
  ): Promise<{
    lastTen: Score[] | ScoreError
    topTen: Score[] | ScoreError
  }> => {
    const session: (Session & { uuid: string }) | undefined =
      requestEvent.sharedMap.get('session')

    if (!session) return { lastTen: [], topTen: [] }

    const res: { lastTen: Score[] | ScoreError; topTen: Score[] | ScoreError } =
      { lastTen: [], topTen: [] }

    const db = createKysely<Database.Alic3Dev>({
      connectionString: requestEvent.env.get('POSTGRES_URL'),
    })

    try {
      res.lastTen = await db
        .selectFrom('tirest_scores')
        .select(['game_id', 'level', 'score', 'submitted_timestamp'])
        .where('user_uuid', '=', session.uuid)
        .orderBy('submitted_timestamp desc')
        .limit(10)
        .execute()
    } catch {
      res.lastTen = {
        failed: true,
        errorMessage: errorMessages.default,
      }
    }

    try {
      res.topTen = await db
        .selectFrom('tirest_scores')
        .select(['game_id', 'level', 'score', 'submitted_timestamp'])
        .where('user_uuid', '=', session.uuid)
        .orderBy('score desc')
        .limit(10)
        .execute()
    } catch {
      res.topTen = {
        failed: true,
        errorMessage: errorMessages.default,
      }
    }

    if (!Array.isArray(res.lastTen) || !Array.isArray(res.topTen)) {
      return requestEvent.fail(500, res)
    }

    return res
  },
)

export const useDisplayName = routeLoader$(
  async (
    requestEvent: RequestEventLoader<QwikCityPlatform>,
  ): Promise<string | undefined> => {
    const session: (Session & { uuid: string }) | undefined =
      requestEvent.sharedMap.get('session')

    if (!session) return

    return getDisplayName({ env: requestEvent.env, uuid: session.uuid })
  },
)

export default component$((): JSXOutput => {
  const session: Readonly<Signal<Session | null>> =
    useAuthSession() as Readonly<Signal<Session>>

  const user: Partial<Required<DefaultSession>['user']> =
    session.value?.user ?? {}

  const scoreData = useSignal(useScoreData().value)
  const displayName = useSignal(useDisplayName().value)

  return (
    <Profile
      user={user}
      display_name={displayName.value || ''}
      scores={scoreData.value}
    />
  )
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
