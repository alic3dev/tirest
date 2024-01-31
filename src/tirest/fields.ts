import type { UUID } from 'crypto'

import type { Tirest } from './types'

import { fieldSize } from './constants'

export const fieldLookup: Record<UUID, Uint8Array> = {}

export function generateNewField(): UUID {
  const fieldId: UUID = crypto.randomUUID()
  fieldLookup[fieldId] = new Uint8Array(fieldSize.width * fieldSize.height)

  return fieldId
}

export function lookupField(tirest: Tirest): Uint8Array {
  const field: Uint8Array | undefined = fieldLookup[tirest.fieldId]

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!field) {
    tirest.fieldId = generateNewField() // FIXME: SSR issues - this shouldn't be neccesary

    return lookupField(tirest)
  }

  return field
}
