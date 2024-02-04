export interface ColorPalette {
  name: string
  blocks: [string, string][]
}

export interface Settings {
  musicVolume: number

  inputDelay: number

  selectedColorPalette: ColorPalette
}
