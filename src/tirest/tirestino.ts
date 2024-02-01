import type { Tirestino } from './types'

// .
// .
// .
// .

export const iBlock: Tirestino = {
  id: 0,
  rotateLeftId: 7,
  rotateRightId: 7,
  size: {
    height: 4,
    width: 1,
  },
  data: new Uint8Array([1, 1, 1, 1]),
}

export const iBlock90Deg: Tirestino = {
  id: 7,
  rotateLeftId: 0,
  rotateRightId: 0,
  size: {
    height: 1,
    width: 4,
  },
  data: new Uint8Array([1, 1, 1, 1]),
}

//
//   .
// . . .
//

export const tBlock: Tirestino = {
  id: 1,
  rotateLeftId: 10,
  rotateRightId: 8,
  size: {
    height: 2,
    width: 3,
  },
  data: new Uint8Array([0, 2, 0, 2, 2, 2]),
}

export const tBlock90Deg: Tirestino = {
  id: 8,
  rotateLeftId: 1,
  rotateRightId: 9,
  size: {
    height: 3,
    width: 2,
  },
  data: new Uint8Array([2, 0, 2, 2, 2, 0]),
}

export const tBlock180Deg: Tirestino = {
  id: 9,
  rotateLeftId: 8,
  rotateRightId: 10,
  size: {
    height: 2,
    width: 3,
  },
  data: new Uint8Array([2, 2, 2, 0, 2, 0]),
}

export const tBlock270Deg: Tirestino = {
  id: 10,
  rotateLeftId: 9,
  rotateRightId: 1,
  size: {
    height: 3,
    width: 2,
  },
  data: new Uint8Array([0, 2, 2, 2, 0, 2]),
}

//
// .
// .
// . .

export const lBlock: Tirestino = {
  id: 2,
  rotateLeftId: 13,
  rotateRightId: 11,
  size: {
    height: 3,
    width: 2,
  },
  data: new Uint8Array([3, 0, 3, 0, 3, 3]),
}

export const lBlock90Deg: Tirestino = {
  id: 11,
  rotateLeftId: 2,
  rotateRightId: 12,
  size: {
    height: 2,
    width: 3,
  },
  data: new Uint8Array([3, 3, 3, 3, 0, 0]),
}

export const lBlock180Deg: Tirestino = {
  id: 12,
  rotateLeftId: 11,
  rotateRightId: 13,
  size: {
    height: 3,
    width: 2,
  },
  data: new Uint8Array([3, 3, 0, 3, 0, 3]),
}

export const lBlock270Deg: Tirestino = {
  id: 13,
  rotateLeftId: 12,
  rotateRightId: 2,
  size: {
    height: 2,
    width: 3,
  },
  data: new Uint8Array([0, 0, 3, 3, 3, 3]),
}

//
//   .
//   .
// . .

export const rBlock: Tirestino = {
  id: 3,
  rotateLeftId: 16,
  rotateRightId: 14,
  size: {
    height: 3,
    width: 2,
  },
  data: new Uint8Array([0, 4, 0, 4, 4, 4]),
}

export const rBlock90Deg: Tirestino = {
  id: 14,
  rotateLeftId: 3,
  rotateRightId: 15,
  size: {
    height: 2,
    width: 3,
  },
  data: new Uint8Array([4, 0, 0, 4, 4, 4]),
}

export const rBlock180Deg: Tirestino = {
  id: 15,
  rotateLeftId: 14,
  rotateRightId: 16,
  size: {
    height: 3,
    width: 2,
  },
  data: new Uint8Array([4, 4, 4, 0, 4, 0]),
}

export const rBlock270Deg: Tirestino = {
  id: 16,
  rotateLeftId: 15,
  rotateRightId: 3,
  size: {
    height: 2,
    width: 3,
  },
  data: new Uint8Array([4, 4, 4, 0, 0, 4]),
}

//
//
// . .
// . .

export const oBlock: Tirestino = {
  id: 4,
  rotateLeftId: 4,
  rotateRightId: 4,
  size: {
    height: 2,
    width: 2,
  },
  data: new Uint8Array([5, 5, 5, 5]),
}

//
//
// . .
//   . .

export const zBlock: Tirestino = {
  id: 5,
  rotateLeftId: 17,
  rotateRightId: 17,
  size: {
    height: 2,
    width: 3,
  },
  data: new Uint8Array([6, 6, 0, 0, 6, 6]),
}

export const zBlock90Deg: Tirestino = {
  id: 17,
  rotateLeftId: 5,
  rotateRightId: 5,
  size: {
    height: 3,
    width: 2,
  },
  data: new Uint8Array([0, 6, 6, 6, 6, 0]),
}

//
//
//   . .
// . .

export const sBlock: Tirestino = {
  id: 6,
  rotateLeftId: 18,
  rotateRightId: 18,
  size: {
    height: 2,
    width: 3,
  },
  data: new Uint8Array([0, 7, 7, 7, 7, 0]),
}

export const sBlock90Deg: Tirestino = {
  id: 18,
  rotateLeftId: 6,
  rotateRightId: 6,
  size: {
    height: 3,
    width: 2,
  },
  data: new Uint8Array([7, 0, 7, 7, 0, 7]),
}

export const tirestinos: Record<string, Tirestino> = {
  iBlock,
  iBlock90Deg,
  lBlock,
  lBlock90Deg,
  lBlock180Deg,
  lBlock270Deg,
  oBlock,
  rBlock,
  rBlock90Deg,
  rBlock180Deg,
  rBlock270Deg,
  sBlock,
  sBlock90Deg,
  tBlock,
  tBlock90Deg,
  tBlock180Deg,
  tBlock270Deg,
  zBlock,
  zBlock90Deg,
}

const sortTirestinosById = (a: Tirestino, b: Tirestino): number => a.id - b.id

export const defaultTirestinos: Tirestino[] = [
  tirestinos.iBlock,
  tirestinos.lBlock,
  tirestinos.oBlock,
  tirestinos.rBlock,
  tirestinos.sBlock,
  tirestinos.tBlock,
  tirestinos.zBlock,
].sort(sortTirestinosById)

export const defaultTirestinosWithRotations: Tirestino[] = [
  ...defaultTirestinos,
  tirestinos.iBlock90Deg,
  tirestinos.tBlock90Deg,
  tirestinos.tBlock180Deg,
  tirestinos.tBlock270Deg,
  tirestinos.lBlock90Deg,
  tirestinos.lBlock180Deg,
  tirestinos.lBlock270Deg,
  tirestinos.rBlock90Deg,
  tirestinos.rBlock180Deg,
  tirestinos.rBlock270Deg,
  tirestinos.zBlock90Deg,
  tirestinos.sBlock90Deg,
].sort(sortTirestinosById)

export function lookupTirestino(id: number): Tirestino {
  return defaultTirestinosWithRotations[id]
}
