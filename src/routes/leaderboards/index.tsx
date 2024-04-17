import type { JSXOutput, Signal } from '@builder.io/qwik'
import type {
  RequestEventLoader,
  DocumentHead,
  RequestHandler,
} from '@builder.io/qwik-city'

import type { ScoreError, ScoreWithUser } from '~/types'

import { component$, useSignal } from '@builder.io/qwik'
import { routeLoader$ } from '@builder.io/qwik-city'

import { cascadingDifferenceDisplay } from '~/utils/dates'

import { getLeaderboardCache } from '~/utils/server/scores'
import { errors as errorMessages } from '~/utils/messages'

import styles from './index.module.scss'

export const onGet: RequestHandler = async ({ cacheControl }) => {
  cacheControl({
    public: true,
    maxAge: 0,
    staleWhileRevalidate: 0,
  })
}

export const useGetLeaderboard = routeLoader$(
  async (
    requestEvent: RequestEventLoader<QwikCityPlatform>,
  ): Promise<ScoreWithUser[] | ScoreError> => {
    const { res, err }: { res?: ScoreWithUser[]; err?: string } =
      await getLeaderboardCache({ env: requestEvent.env })

    if (res) return res

    return requestEvent.fail(500, {
      errorMessage: err ?? errorMessages.default,
    })
  },
)

export default component$((): JSXOutput => {
  const currentDate: Signal<Date> = useSignal<Date>(() => new Date())
  const leaderboard: Readonly<Signal<ScoreWithUser[] | ScoreError>> =
    useGetLeaderboard()

  return (
    <div key={Math.random()}>
      <h2 class={styles.title}>Leaderboards</h2>

      {(Array.isArray(leaderboard.value) && (
        <table class={styles.scores}>
          <thead>
            <tr>
              <th>User</th>
              <th>Level</th>
              <th>Score</th>
              <th>Played</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.value.map(
              (scoreWithUser: ScoreWithUser): JSXOutput => {
                let playedAt: string = cascadingDifferenceDisplay(
                  currentDate.value,
                  scoreWithUser.submitted_timestamp,
                )

                if (playedAt !== 'Today') {
                  playedAt += ' ago'
                }

                return (
                  <tr key={scoreWithUser.game_id}>
                    <td>{scoreWithUser.display_name}</td>
                    <td>{scoreWithUser.level}</td>
                    <td>{scoreWithUser.score}</td>
                    <td>{playedAt}</td>
                  </tr>
                )
              },
            )}
          </tbody>
        </table>
      )) ||
        ((leaderboard.value as ScoreError).failed && (
          <div>{(leaderboard.value as ScoreError).errorMessage}</div>
        )) || <div>{errorMessages.default}</div>}
    </div>
  )
})

export const head: DocumentHead = {
  title: 'Tirest - Leaderboards',
}
