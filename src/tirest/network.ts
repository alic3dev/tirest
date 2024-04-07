import type { Tirest } from 'tirest/types'

export async function postScore(tirest: Tirest) {
  fetch('/api/scores', {
    method: 'POST',
    body: JSON.stringify({
      game_id: tirest.id,
      level: tirest.level.number,
      score: tirest.progress.totals.score,
    }),
  })
    .then((res): Promise<any> => {
      if (res.status === 401) {
        throw new Error('Unauthorized')
      } else if (res.status !== 200) {
        throw new Error('Unknown error')
      }

      return res.json()
    })
    .then((data): void => {
      console.log(data)
    })
    .catch((): void => {})
}
