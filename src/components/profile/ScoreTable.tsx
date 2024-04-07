import type { JSXOutput } from '@builder.io/qwik'

import type { Score, ScoreError } from '~/types'

import { component$ } from '@builder.io/qwik'

import { cascadingDifferenceDisplay } from '~/utils/dates'

import styles from './ScoreTable.module.scss'

export const ScoreTable = component$(
  ({
    title,
    scores,
    currentDate,
  }: {
    title: string
    scores: Score[] | ScoreError
    currentDate: Date
  }): JSXOutput => {
    return (
      <div class={styles.scores}>
        <h3 class={styles.title}>{title}</h3>

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
                          currentDate,
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
    )
  },
)
