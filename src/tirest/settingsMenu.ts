import type { Tirest, MenuItem, ColorPalette } from './types'

import { colorPalettes } from './colorPalettes'

export const settingsMenu: MenuItem[] = [
  {
    title: 'Key bindings',
    type: 'Expandable',
    items: [],
  },
  {
    title: 'Color theme',
    type: 'List',
    getMin(): string {
      return colorPalettes[0].name
    },
    getMax(): string {
      return colorPalettes[colorPalettes.length - 1].name
    },
    getValue(tirest: Tirest): string {
      return tirest.settings.selectedColorPalette.name
    },
    onDecrement(tirest: Tirest): void {
      const prevIndex: number = colorPalettes.findIndex(
        (palette: ColorPalette): boolean =>
          palette.name === tirest.settings.selectedColorPalette.name,
      )

      tirest.settings.selectedColorPalette =
        colorPalettes[Math.max(prevIndex - 1, 0)]
    },
    onIncrement(tirest: Tirest): void {
      const prevIndex: number = colorPalettes.findIndex(
        (palette: ColorPalette): boolean =>
          palette.name === tirest.settings.selectedColorPalette.name,
      )

      tirest.settings.selectedColorPalette =
        colorPalettes[Math.min(prevIndex + 1, colorPalettes.length - 1)]
    },
  },
  {
    title: 'Input delay',
    type: 'Numeric',
    getMin() {
      return 0
    },
    getMax() {
      return null
    },
    getValue(tirest: Tirest): number {
      return tirest.settings.inputDelay
    },
    onDecrement(tirest: Tirest): void {
      tirest.settings.inputDelay = Math.max(tirest.settings.inputDelay - 1, 0)
    },
    onIncrement(tirest: Tirest): void {
      tirest.settings.inputDelay++
    },
  },
]
