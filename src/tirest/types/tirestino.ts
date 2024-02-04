import type { Size } from 'tirest/types/utils'

export interface Tirestino {
  readonly id: number

  readonly rotateLeftId: number
  readonly rotateRightId: number

  readonly size: Readonly<Size>

  readonly data: Uint8Array
}
