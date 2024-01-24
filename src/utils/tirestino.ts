export interface Tirestino {
  readonly id: number
  readonly size: {
    readonly height: number
    readonly width: number
  }
  readonly data: Uint8Array
}

// .
// .
// .
// .

export const iBlock: Tirestino = {
  id: 0,
  size: {
    height: 4,
    width: 1,
  },
  data: new Uint8Array([1, 1, 1, 1]),
}

//
//   .
// . . .
//

export const tBlock: Tirestino = {
  id: 1,
  size: {
    height: 2,
    width: 3,
  },
  data: new Uint8Array([0, 2, 0, 2, 2, 2]),
}

//
// .
// .
// . .

export const lBlock: Tirestino = {
  id: 2,
  size: {
    height: 3,
    width: 2,
  },
  data: new Uint8Array([3, 0, 3, 0, 3, 3]),
}

//
//   .
//   .
// . .

export const rBlock: Tirestino = {
  id: 3,

  size: {
    height: 3,
    width: 2,
  },
  data: new Uint8Array([0, 4, 0, 4, 4, 4]),
}

//
//
// . .
// . .

export const oBlock: Tirestino = {
  id: 4,

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

  size: {
    height: 2,
    width: 3,
  },
  data: new Uint8Array([6, 6, 0, 0, 6, 6]),
}

//
//
//   . .
// . .

export const sBlock: Tirestino = {
  id: 6,

  size: {
    height: 2,
    width: 3,
  },
  data: new Uint8Array([0, 7, 7, 7, 7, 0]),
}

// export const tirestinos = [
//   iBlock,
//   tBlock,
//   lBlock,
//   rBlock,
//   oBlock,
//   zBlock,
//   sBlock,
// ]
