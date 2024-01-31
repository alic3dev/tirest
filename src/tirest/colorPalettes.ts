export interface ColorPalette {
  blocks: [string, string][]
}

export const standard: ColorPalette = {
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

export const selectedColorPalette: ColorPalette = standard
