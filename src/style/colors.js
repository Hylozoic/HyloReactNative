import tinycolor from 'tinycolor2'

// when adding a color, use http://chir.ag/projects/name-that-color/ to name it.
export const azureRadiance = '#007AFF'
export const capeCod = '#363D3C'
export const bigStone = '#142132'
export const derby = '#FFEEDA'
export const ghost = '#CCD1D7'
export const havelockBlue = '#41A1DC' // discussion
export const jade = '#06C470' // offer
export const limedSpruce = '#38474A'
export const mangoYellow = '#FDD549' // resource
export const mineralGreen = '#304843'
export const mirage = '#1F2C3D'
export const nevada = '#5D757A'
export const persimmon = '#FE6848'
export const rhino = '#2C4059'
export const slateGrey = '#67768A'
export const westSide = '#FF9712' // request
export const caribbeanGreen = '#0DC39F' // primary green
export const black = 'black'
export const alabaster = '#F8F8F8'
export const linkWater = '#D9ECF8'
export const fuchsiaPink = '#BB60A8'
export const pictonBlue = '#40A1DD'
export const amaranth = '#EE4266'
export const gunsmoke = '#818A88'
export const treePoppy = '#FF9D21'
export const prim = '#F1DFEE'
export const suvaGrey = '#929292'
export const gainsboro = '#DCDCDC'

// these colors are the equivalent of reducing the opacity of the colors named
// above, on a white background. use these where possible, to avoid any impact
// to mobile performance.
// You can calculate this using: http://tdekoning.github.io/rgba-converter/
export const capeCod05 = fakeAlpha(capeCod, 0.05)
export const capeCod10 = fakeAlpha(capeCod, 0.1)
export const capeCod20 = fakeAlpha(capeCod, 0.2)
export const capeCod40 = fakeAlpha(capeCod, 0.4)
export const rhino05 = fakeAlpha(rhino, 0.05)
export const rhino10 = fakeAlpha(rhino, 0.1)
export const rhino20 = fakeAlpha(rhino, 0.2)
export const rhino30 = fakeAlpha(rhino, 0.3)
export const rhino40 = fakeAlpha(rhino, 0.4)
export const rhino50 = fakeAlpha(rhino, 0.5)
export const rhino60 = fakeAlpha(rhino, 0.6)
export const rhino80 = fakeAlpha(rhino, 0.8)
export const black10onRhino = fakeAlpha('#000000', 0.1, rhino)
export const slateGrey80 = '#8490a1'

export const white = '#FFFFFF'
export const white80onCaribbeanGreen = fakeAlpha('#FFFFFF', 0.8, caribbeanGreen)
export const white60onCaribbeanGreen = fakeAlpha('#FFFFFF', 0.6, caribbeanGreen)
export const white40onCaribbeanGreen = fakeAlpha('#FFFFFF', 0.4, caribbeanGreen)
export const white20onCaribbeanGreen = fakeAlpha('#FFFFFF', 0.2, caribbeanGreen)
export const black10OnCaribbeanGreen = fakeAlpha('#000000', 0.1, caribbeanGreen)

export const bigStone30 = fakeAlpha(bigStone, 0.3)

export const bannerlinearGradientColors = [
  'rgba(0, 0, 0, 0)',
  'rgba(0, 0, 0, 0.1)',
  'rgba(0, 0, 0, 0.3)',
  'rgba(0, 0, 0, 0.6)'
]

export function fakeAlpha (color, alpha, background = '#ffffff') {
  const fg = tinycolor(color).toRgb()
  const bg = tinycolor(background).toRgb()
  const r = fg.r * alpha + bg.r * (1 - alpha)
  const g = fg.g * alpha + bg.g * (1 - alpha)
  const b = fg.b * alpha + bg.b * (1 - alpha)
  return tinycolor({ r, g, b }).toHexString()
}
