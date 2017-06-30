/**
 * @providesModule style/colors
 */

import tinycolor from 'tinycolor2'

// when adding a color, use http://chir.ag/projects/name-that-color/ to name it.
export const azureRadiance = '#007AFF'
export const capeCode = '#363D3C'
export const bigStone = '#142132'
export const derby = '#FFEEDA'
export const ghost = '#CCD1D7'
export const havelockBlue = '#41A1DC'
export const jade = '#06C470'
export const limedSpruce = '#38474A'
export const mirage = '#1F2C3D'
export const rhino = '#2C4059'
export const westSide = '#FF9712'

// these colors are the equivalent of reducing the opacity of the colors named
// above, on a white background. use these where possible, to avoid any impact
// to mobile performance.
// You can calculate this using: http://tdekoning.github.io/rgba-converter/
export const capeCod10 = '#EBEBEB'
export const capeCod40 = '#A79A9A'
export const rhino10 = fakeAlpha(rhino, 0.1)
export const rhino30 = '#AAACAC'
export const rhino50 = '#8994A3'

export function fakeAlpha (color, alpha, background = '#ffffff') {
  const fg = tinycolor(color).toRgb()
  const bg = tinycolor(background).toRgb()
  const r = fg.r * alpha + bg.r * (1 - alpha)
  const g = fg.g * alpha + bg.g * (1 - alpha)
  const b = fg.b * alpha + bg.b * (1 - alpha)
  return tinycolor({r, g, b}).toHexString()
}
