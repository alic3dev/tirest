import type { DefaultSession } from '@auth/core/types'
import type { JSXOutput } from '@builder.io/qwik'

import { component$, useSignal } from '@builder.io/qwik'

import { cascadingDifferenceDisplay } from '~/utils/dates'

import styles from './profile.module.scss'

export interface ScoreError {
  failed: boolean
  errorMessage: string
}

export interface Score {
  game_id: string
  level: number
  score: number
  submitted_timestamp: Date
}

export const Profile = component$(
  ({
    user,
    scores,
  }: {
    user: Partial<Required<DefaultSession>['user']>
    scores: Score[] | ScoreError
  }): JSXOutput => {
    const currentDate = useSignal<Date>((): Date => new Date())

    return (
      <div class={styles.profile}>
        <h2 class={styles.header}>Profile</h2>

        <div class={styles.content}>
          <div class={styles.info}>
            <div class={styles['profile-image-wrapper']}>
              {user.image && <img src={user.image} height={96} width={96} />}
            </div>

            <label>
              Name
              <input type="text" value={user.name} disabled />
            </label>

            <label>
              Email
              <input type="text" value={user.email} disabled />
            </label>
          </div>

          <div class={styles.scores}>
            <h3 class={styles.title}>Last 10 scores</h3>

            <table class={styles['scores-table']}>
              <thead>
                <tr>
                  <th>Level</th>
                  <th>Score</th>
                  <th>Played</th>
                </tr>
              </thead>
              <tbody>
                {((scores as ScoreError).failed && (
                  <div>{(scores as ScoreError).errorMessage}</div>
                )) || (
                  <>
                    {(scores as Score[]).map(
                      (score: Score): JSXOutput => (
                        <tr key={score.game_id}>
                          <td>{score.level}</td>
                          <td>{score.score}</td>
                          <td>
                            {cascadingDifferenceDisplay(
                              currentDate.value,
                              score.submitted_timestamp,
                            )}{' '}
                            ago
                          </td>
                        </tr>
                      ),
                    )}

                    {(scores as Score[]).length < 10 &&
                      new Array<null>(10 - (scores as Score[]).length)
                        .fill(null)
                        .map(
                          (_nullVal: null, index: number): JSXOutput => (
                            <tr key={index}>
                              <td>-</td>
                              <td>-</td>
                              <td>-</td>
                            </tr>
                          ),
                        )}
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  },
)
