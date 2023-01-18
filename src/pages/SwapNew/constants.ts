export const SWAPBOX_WIDTH = 'min(467px, 100%)'
export const ELEMENTS_BACKGROUND =
  'radial-gradient(173.28% 128.28% at 50.64% 0%, rgba(170, 162, 255, 0.06) 0%, rgba(0, 0, 0, 0) 100%), rgba(19, 19, 32, 0.5)'
export const ELEMENTS_SPACING = '6px'
export const TEXT_COLOR_PRIMARY = '#fff'
export const TEXT_COLOR_SECONDARY = '#8780bf'
export const getSwapButtonHoverColor = (color: string) =>
  `linear-gradient(0deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05)), ${color}`
export const getSwapButtonActiveColor = (color: string) =>
  `linear-gradient(0deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), ${color}`