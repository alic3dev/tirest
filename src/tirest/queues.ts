import type { UUID } from 'crypto'

import type { Tirest, Tirestino } from 'tirest/types'

import { defaultTirestinos } from 'tirest/tirestino'

export const tirestinoQueues: Record<UUID, Tirestino[]> = {}

export function generateNewTirestinoQueue(): UUID {
  const blankQueue: Tirestino[] = [...defaultTirestinos, ...defaultTirestinos]
  const randomQueue: Tirestino[] = []

  while (blankQueue.length) {
    randomQueue.push(
      ...blankQueue.splice(
        Math.floor(Math.random() * blankQueue.length - 1),
        1,
      ),
    )
  }

  const tirestinoQueueId: UUID = crypto.randomUUID()
  tirestinoQueues[tirestinoQueueId] = randomQueue

  return tirestinoQueueId
}

export function lookupTirestinoQueue(tirest: Tirest): Tirestino[] {
  const tirestinoQueue: Tirestino[] | undefined =
    tirestinoQueues[tirest.tirestinoQueueId]

  return tirestinoQueue
}
