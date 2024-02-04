import type { UUID } from 'crypto'

import type { Size, Tirest } from 'tirest/types'

import { fieldSize as _fieldSize } from 'tirest/constants'

export const fieldLookup: Record<UUID, Uint8Array> = {}

export function generateNewField(fieldSize: Size = _fieldSize): UUID {
  const fieldId: UUID = crypto.randomUUID()
  fieldLookup[fieldId] = new Uint8Array(fieldSize.width * fieldSize.height)

  return fieldId
}

export function lookupField(tirest: Tirest): Uint8Array {
  const field: Uint8Array | undefined = fieldLookup[tirest.fieldId]

  return field
}
