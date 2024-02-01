import type { ColorPalette } from './types'

export const standard: ColorPalette = {
  name: 'Marsh',
  blocks: [
    ['#0FF', '#099'],
    ['#FF0', '#990'],
    ['#0F0', '#090'],
    ['#F00', '#090'],
    ['#AF0', '#090'],
    ['#0FA', '#090'],
    ['#AA0', '#090'],
  ],
}

export const colorPalettes: ColorPalette[] = [
  standard,
  {
    name: 'Night',
    blocks: [
      ['#0FF', '#0FF'],
      ['#3aB', '#0FF'],
      ['#0aF', '#0FF'],
      ['#50F', '#0FF'],
      ['#66F', '#0FF'],
      ['#00F', '#0FF'],
      ['#0AA', '#0FF'],
    ],
  },
]
