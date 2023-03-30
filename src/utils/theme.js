import { darken, lighten, transparentize } from 'polished'

const colorList = ['slateblue', 'goldenrod', 'royalblue', 'orangered']

const themeConfig = {
  accent: '#304FFE',
  randomAccent: false,
  colorList: colorList,
}

const basicPalette = {
  black: '#000000',
  white: '#FFFFFF',
  background: 'rgba(12, 11, 18, 1)',
  accent: themeConfig.randomAccent ? colorList[getRandomInt(colorList.length - 1)] : themeConfig.accent,
  blueGray: 'rgba(177, 191, 128, 1)',
  gray: 'rgba(202, 203, 181, 1)',
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max)
}

const expandedPalette = {
  ...basicPalette,
  accentLight: () => lighten(0.025, basicPalette.accent),
  accentExtraLight: () => lighten(0.2, basicPalette.accent),
  gray600: () => lighten(0.15, basicPalette.black),
  gray500: () => lighten(0.22, basicPalette.black),
  gray400: () => lighten(0.35, basicPalette.black),
  gray300: () => lighten(0.5, basicPalette.black),
  gray100: () => lighten(0.1, basicPalette.black),
  blue500: () => darken(0.4, basicPalette.blue),
  purple500: () => darken(0.4, basicPalette.purple),
}

const theme = {
  ...basicPalette,
  ...expandedPalette,
}

export const breakpoints = {
  xs: '416px',
  s: '600px',
  md: '959px',
  l: '1360px',
  xl: '1620px',
}

export const boxShadow = {
  md: `0 0 10px ${transparentize(0.4, basicPalette.black)}`,
  l: `0 0 30px ${transparentize(0.6, basicPalette.black)}`,
}

export const gradients = {
  primary: 'linear-gradient(270deg, rgba(88, 88, 78, 0.25), rgba(219, 219, 140, 0.96))',
  primaryLabel: 'linear-gradient(90.22deg, #24292d 0.62%, #f1e265 105.85%)',
  cta: 'linear-gradient(266.97deg, #f1e265 5.64%, rgba(219, 219, 140, 0.96) 53.85%, #f1e265 97.29%)',
  heroMainText: 'linear-gradient(270deg, #FFFFFF 1.98%, #DCD8FE 95.72%)',
  glow: 'radial-gradient(closest-side, rgba(51, 55, 10, 1) 20%, rgba(20, 10, 55, 0) 100%)',
  yellowDimDark: 'linear-gradient(256.45deg,rgb(131 152 15 / 20%) 7%,rgb(82 82 60 / 0%) 66%)',
  yellowDim:
    'linear-gradient(118.9deg, rgba(255, 255, 255, 0.2) -0.59%, rgba(0, 0, 0, 0) 132.78%), rgba(84, 88, 55, 0.7);',
}

export default theme
