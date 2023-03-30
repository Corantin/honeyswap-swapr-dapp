import { transparentize } from 'polished'
import { ReactNode, useMemo } from 'react'
import 'react-datepicker/dist/react-datepicker.min.css'
import { Text, TextProps } from 'rebass'
import styled, {
  createGlobalStyle,
  css,
  DefaultTheme,
  ThemeProvider as StyledComponentsThemeProvider,
} from 'styled-components'

import { useIsDarkMode } from '../state/user/hooks'
import { Colors } from './styled'

export * from './components'

export const MEDIA_WIDTHS = {
  upToExtraSmall: 500,
  upToSmall: 720,
  upToMedium: 960,
  upToLarge: 1280,
}

const mediaWidthTemplates: {
  [width in keyof typeof MEDIA_WIDTHS]: typeof css
} = Object.keys(MEDIA_WIDTHS).reduce((accumulator, size) => {
  ;(accumulator as any)[size] = (a: any, b: any, c: any) => css`
    @media (max-width: ${(MEDIA_WIDTHS as any)[size]}px) {
      ${css(a, b, c)}
    }
  `
  return accumulator
}, {}) as any

const white = '#FFFFFF'
const black = '#000000'

export function colors(darkMode: boolean): Colors {
  return {
    // base
    white: darkMode ? white : black,
    black,

    // gradient colors
    grd1: darkMode ? '#394F50' : '#FFC3AB',
    grd2: darkMode ? '#212429' : '#FAFAE2',
    grd3: darkMode ? '#394F50' : '#CBF3EF',

    // text
    text1: darkMode ? '#FFFFFF' : '#000000',
    text2: darkMode ? '#cbcbc3' : '#565A69',
    text3: darkMode ? '#d3d3bb' : '#888D9B',
    text4: darkMode ? '#bdbc9c' : '#C3C5CB',
    text5: darkMode ? '#cacbc3' : '#888d9b',
    text6: '#afb18c',

    // backgrounds / greys
    bg1: darkMode ? '#1d1f24' : '#FFFFFF',
    bg1And2: darkMode ? '#212429' : '#FFFFFF',
    bg2: darkMode ? '#2c2f36' : '#F7F8FA',
    bg3: darkMode ? '#4f4d40' : '#EDEEF2',
    bg4: darkMode ? '#686956' : '#CED0D9',
    bg5: darkMode ? '#84846c' : '#888D9B',
    bg6: darkMode ? '#323232' : '#888D9B',
    bg7: '#403f2d',
    bg8: '#242419',
    bg9: '#171b26;',

    //specialty colors
    modalBG: darkMode ? 'rgba(0,0,0,.425)' : 'rgba(0,0,0,0.3)',
    advancedBG: darkMode ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.6)',

    //primary colors
    primary1: darkMode ? '#b9a552' : '#7CE0D6',
    primary2: darkMode ? '#FFE270FD' : '#7CE0D6',
    primary3: darkMode ? '#FFE270FC' : '#7CE0D6',
    primary4: darkMode ? '#FFE270FB' : '#7CE0D6',
    primary5: darkMode ? '#FFE270FA' : '#7CE0D6',
    // color text
    primaryText1: darkMode ? 'rgba(44, 52, 55, 0.8)' : '#ffff',

    // secondary colors
    secondary1: darkMode ? '#ffe27094' : '#7CE0D6',
    secondary2: darkMode ? '#ffe27093' : '#7CE0D6',
    secondary3: darkMode ? '#ffe27092' : '#7CE0D6',

    // other
    red1: '#FF6871',
    red2: '#F82D3A',
    orange1: '#f2994a',
    green1: '#27AE60',
    green2: '#0E9F6E',
    yellow1: '#FFE27091',
    yellow2: '#c9cb42',
    yellow3: '#ffe16adf',
    yellow4: '#FFE27089',
    yellow5: '#7e7e7c88',
    yellow6: '#FFE27087',
    blue1: '#2172E5',
    dark4: '#9c9e7e',
    gray1: '#9d9d9d',
    purple: '#2E17F2',

    // dont wanna forget these blue yet
    // blue4: darkMode ? '#153d6f70' : '#C4D9F8',
    // blue5: darkMode ? '#153d6f70' : '#EBF4FF',

    // new UI refactor colors
    mainPurple: '#2E17F2',
    purpleBase: '#101016',
    purpleOverlay: '#111018',
    lightPurple: '#2E17F2',
    lightPurple2: '#2E17F2',
    boxShadow: '#0A0A0F',

    // darkest // dark 1.1
    darkest: '#212116',
    dark1: '#212429',
    dark2: '#171a1e',
  }
}

export function theme(darkMode: boolean): DefaultTheme {
  return {
    ...colors(darkMode),

    darkMode,

    grids: {
      sm: 8,
      md: 12,
      lg: 24,
    },

    //shadows
    shadow1: darkMode ? '#000' : '#2F80ED',

    // media queries
    mediaWidth: mediaWidthTemplates,

    // css snippets
    flexColumnNoWrap: css`
      display: flex;
      flex-flow: column nowrap;
    `,
    flexRowNoWrap: css`
      display: flex;
      flex-flow: row nowrap;
    `,
  }
}

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const darkMode = useIsDarkMode()

  const themeObject = useMemo(() => theme(darkMode), [darkMode])

  return <StyledComponentsThemeProvider theme={themeObject}>{children}</StyledComponentsThemeProvider>
}

const TextWrapper = styled(({ color: _color, ...rest }) => <Text {...rest} />)`
  color: ${({ color, theme }) => theme[color]};
`

export const TYPE = {
  Main(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'text2'} {...props} />
  },
  Link(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'primary1'} {...props} />
  },
  Black(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'text1'} {...props} />
  },
  White(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'white'} {...props} />
  },
  Body(props: TextProps) {
    return <TextWrapper fontWeight={400} fontSize={16} lineHeight="20px" color={'text5'} {...props} />
  },
  LargeHeader(props: TextProps) {
    return <TextWrapper fontWeight={600} fontSize={24} {...props} />
  },
  MediumHeader(props: TextProps) {
    return <TextWrapper fontWeight={500} fontSize={20} {...props} />
  },
  SubHeader(props: TextProps) {
    return <TextWrapper fontWeight={400} fontSize={14} {...props} />
  },
  Small(props: TextProps) {
    return <TextWrapper fontWeight={500} fontSize={11} {...props} />
  },
  Blue(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'primary1'} {...props} />
  },
  Yellow(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'yellow1'} {...props} />
  },
  DarkGray(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'text3'} {...props} />
  },
  Gray(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'bg3'} {...props} />
  },
  Italic(props: TextProps) {
    return <TextWrapper fontWeight={500} fontSize={12} fontStyle={'italic'} color={'text2'} {...props} />
  },
  Error({ error, ...props }: { error: boolean } & TextProps) {
    return <TextWrapper fontWeight={500} color={error ? 'red1' : 'text2'} {...props} />
  },
}

export const FixedGlobalStyle = createGlobalStyle`
* {
  font-family: 'Montserrat', sans-serif;
  font-display: fallback;
}

html,
body {
  padding: 0;
  margin: 0 !important;
}

* {
  box-sizing: border-box;
}

button {
  user-select: none;
}

html {
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);

}

a {
  text-decoration: none;
}

body.no-margin {
  margin: 0 !important;
}
`

export const ThemedGlobalStyle = createGlobalStyle`
html {
  color: ${({ theme }) => theme.text1};
  background-color: ${({ theme }) => theme.grd1};
  background: linear-gradient(111.63deg, ${({ theme }) => theme.grd1} 0%, ${({ theme }) => theme.grd2} 49.48%, ${({
  theme,
}) => theme.grd3} 100%);
}

body {
  min-height: 100vh;
  background-position: 0 -30vh;
  background-repeat: no-repeat;
  background-image: ${({ theme }) =>
    `radial-gradient(50% 50% at 50% 50%, ${transparentize(0.9, theme.primary1)} 0%, ${transparentize(
      1,
      theme.bg1
    )} 100%)`};
  margin: 0 !important;
}

.react-datepicker-wrapper {
  width: 100%;
}

.react-datepicker {
  font-family: Montserrat !important;
  border: solid 1px ${props => props.theme.bg5} !important;
  border-radius: 8px !important;
  color: ${props => props.theme.text4} !important;
  background-color: ${props => props.theme.bg1} !important;
  background: linear-gradient(113.18deg, rgba(255, 255, 255, 0.35) -0.1%, rgba(0, 0, 0, 0) 98.9%),
  ${({ theme }) => theme.bg1} !important;
  background-blend-mode: overlay, normal !important;
}

.react-datepicker__triangle {
  border-bottom-color: ${props => props.theme.bg1} !important;
}

.react-datepicker__header {
  background-color: transparent !important;
  border-top-left-radius: 8px;
  border-bottom: none !important;
}

.react-datepicker__current-month {
  color: ${props => props.theme.text4} !important;
}

.react-datepicker__day-name {
  color: ${props => props.theme.text4} !important;
  font-weight: 600;
}

.react-datepicker__day.react-datepicker__day--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.react-datepicker__time-container .react-datepicker__time {
  background: transparent !important;
}

.react-datepicker__time-container  {
  border-left: solid 1px ${props => props.theme.bg5} !important;
}

.react-datepicker-time__header  {
  color: ${props => props.theme.bg5} !important;
}

.react-datepicker__time-list-item {
  transition: background-color 0.3s ease;
  :hover:not(.react-datepicker__time-list-item--disabled) {
    background-color: ${props => props.theme.bg2} !important;
  }
}

.react-datepicker__time-list-item.react-datepicker__time-list-item--disabled {
  opacity: 0.5;
  color: ${props => props.theme.text4} !important;
}

.react-datepicker__header.react-datepicker__header--time {
  border-bottom: solid 1px ${props => props.theme.bg5} !important;
}

.react-datepicker__day--keyboard-selected {
  background-color: ${props => props.theme.bg2} !important;
}

.swapr-pagination {
  list-style: none;
  padding: 0;
}

.swapr-pagination ul {
  display: inline-flex;
}

.swapr-pagination li {
  display: inline-block;
  min-width: 28px;
  height: 22px;
  margin-right: 8px;
  vertical-align: middle;
  list-style: none;
  outline: 0;
  cursor: pointer;
  user-select: none;
  border: solid 1px ${props => props.theme.bg3};
  transition: border 0.3s ease, color 0.3s ease;
  font-size: 16px;
  border-radius: 4px;
  text-align: center;
  line-height: 20px;
  color: ${props => props.theme.text5};

}
.swapr-pagination li:last-child {
  margin-right: 0;
}

.swapr-pagination li.rc-pagination-item-active {
  border: solid 1px ${props => props.theme.bg4};
}

.swapr-pagination li.rc-pagination-prev,
.swapr-pagination li.rc-pagination-next {
  color: ${props => props.theme.white};
  padding-top: 2px;
}

.swapr-pagination li.rc-pagination-options {
  display: none;
}

.swapr-pagination li.rc-pagination-disabled {
  border: solid 1px ${props => props.theme.bg3};
  color: ${props => props.theme.bg3};
}

.custom-toast-root {
    margin-top: 86px;
    min-width: 350px;
}

.custom-toast-container {
    box-shadow: 0px 16px 12px ${({ theme }) => transparentize(0.55, theme.boxShadow)};
    border-radius: 12px !important;
}

.custom-toast-body {
    padding: 4px 8px;
}

.custom-toast-body a{
  font-size: 16px;
}

.Toastify__toast {
    min-height: auto !important;
    padding: 8px 10px 12px 4px;
}

.Toastify__toast--info {
    background: ${props => props.theme.bg1} !important;
}

.walletconnect-connect__button__text {
  font-size: inherit !important;
}

@media only screen and (max-width: 600px) {
	.Toastify__toast-container--top-right {
	    top: auto !important;
	    bottom: 70px !important;
	    left: 12px !important;
	    right: 12px !important;
	}

  .Toastify__toast-container {
	    width: auto !important;
	}

  .walletconnect-connect__button__text {
    font-size: 10px !important;
  }
}

.rc-pagination-simple-pager {
  padding: 0 16px;
}

.rc-pagination-slash {
  margin: 0 10px 0 7px;
}

.rc-pagination-simple-pager > input {
  padding: 0;
  max-width: 20px;
  background-color: transparent;
  outline: none;
  border: none;
  color: ${props => props.theme.text1};
}


.walletconnect-modal__mobile__toggle a {
  color: rgb(64, 153, 255);
}

@keyframes rotation {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(359deg);
  }
}

.rotate {
  animation: rotation 2s infinite linear;
}

@keyframes loading-rotations {
  0% {
    opacity:1;
  }
  6.25% {
    opacity:1;
  }
  12.5% {
    opacity:0;
  }
  93.75% {
    opacity:0;
  }
  100% {
    opacity:1;
  }
}

@keyframes loading-rotations-1 {
  0% {
    opacity:0;
  }
  6.25% {
    opacity:0;
  }
  12.5% {
    opacity:1;
  }
  93.75% {
    opacity:1;
  }
  100% {
    opacity:0;
  }
}

@keyframes loading-rotations-2 {
  0% {
    opacity:1;
  }
  27% {
    opacity:1;
  }
  44% {
    opacity:0;
  }
  84% {
    opacity:0;
  }
  100% {
    opacity:1;
  }
}

@keyframes loading-rotations-3 {
  0% {
    opacity:1;
  }
  22% {
    opacity:1;
  }
  34% {
    opacity:0;
  }
  88% {
    opacity:0;
  }
  100% {
    opacity:1;
  }
}

@keyframes loading-rotations-4 {
  0% {
    opacity:1;
  }
  17% {
    opacity:1;
  }
  25% {
    opacity:0;
  }
  91% {
    opacity:0;
  }
  100% {
    opacity:1;
  }
}

@keyframes loading-rotations-5 {
  0% {
    opacity:1;
  }
  13% {
    opacity:1;
  }
  20% {
    opacity:0;
  }
  93% {
    opacity:0;
  }
  100% {
    opacity:1;
  }
}

@keyframes loading-rotations-6 {
  0% {
    opacity:1;
  }
  11% {
    opacity:1;
  }
  17% {
    opacity:0;
  }
  94% {
    opacity:0;
  }
  100% {
    opacity:1;
  }
}

@keyframes loading-rotations-7 {
  0% {
    opacity:1;
  }
  9.5% {
    opacity:1;
  }
  14.2% {
    opacity:0;
  }
  95% {
    opacity:0;
  }
  100% {
    opacity:1;
  }
}

@keyframes loading-rotations-8 {
  0% {
    opacity:1;
  }
  8.33% {
    opacity:1;
  }
  12.5% {
    opacity:0;
  }
  96% {
    opacity:0;
  }
  100% {
    opacity:1;
  }
}

// rotating trade platform logos loading
.loading-rotation-1>div {
  animation-name: loading-rotations-1;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
  animation-duration: 2s;
}

.loading-rotation-1>div:nth-of-type(1) {
  animation-delay: 0s;
}

.loading-rotation-2>div {
  animation-name: loading-rotations-2;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
  animation-duration: 4s;
}

.loading-rotation-2>div:nth-of-type(1) {
  animation-delay: 2s;
}
.loading-rotation-2>div:nth-of-type(2) {
  animation-delay: 0s;
}

.loading-rotation-3>div {
  animation-name: loading-rotations-3;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
  animation-duration: 6s;
}

.loading-rotation-3>div:nth-of-type(1) {
  animation-delay: 4s;
}
.loading-rotation-3>div:nth-of-type(2) {
  animation-delay: 2s;
}
.loading-rotation-3>div:nth-of-type(3) {
  animation-delay: 0s;
}

.loading-rotation-4>div {
  animation-name: loading-rotations-4;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
  animation-duration: 8s;
}

.loading-rotation-4>div:nth-of-type(1) {
  animation-delay: 6s;
}
.loading-rotation-4>div:nth-of-type(2) {
  animation-delay: 4s;
}
.loading-rotation-4>div:nth-of-type(3) {
  animation-delay: 2s;
}
.loading-rotation-4>div:nth-of-type(4) {
  animation-delay: 0s;
}


.loading-rotation-5>div {
  animation-name: loading-rotations-5;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
  animation-duration: 10s;
}

.loading-rotation-5>div:nth-of-type(1) {
  animation-delay: 8s;
}
.loading-rotation-5>div:nth-of-type(2) {
  animation-delay: 6s;
}
.loading-rotation-5>div:nth-of-type(3) {
  animation-delay: 4s;
}
.loading-rotation-5>div:nth-of-type(4) {
  animation-delay: 2s;
}
.loading-rotation-5>div:nth-of-type(5) {
  animation-delay: 0s;
}

.loading-rotation-6>div {
  animation-name: loading-rotations-6;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
  animation-duration: 12s;
}

.loading-rotation-6>div:nth-of-type(1) {
  animation-delay: 10s;
}
.loading-rotation-6>div:nth-of-type(2) {
  animation-delay: 8s;
}
.loading-rotation-6>div:nth-of-type(3) {
  animation-delay: 6s;
}
.loading-rotation-6>div:nth-of-type(4) {
  animation-delay: 4s;
}
.loading-rotation-6>div:nth-of-type(5) {
  animation-delay: 2s;
}
.loading-rotation-6>div:nth-of-type(6) {
  animation-delay: 0s;
}

.loading-rotation-7>div {
  animation-name: loading-rotations-7;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
  animation-duration: 14s;
}

.loading-rotation-7>div:nth-of-type(1) {
  animation-delay: 12s;
}
.loading-rotation-7>div:nth-of-type(2) {
  animation-delay: 10s;
}
.loading-rotation-7>div:nth-of-type(3) {
  animation-delay: 8s;
}
.loading-rotation-7>div:nth-of-type(4) {
  animation-delay: 6s;
}
.loading-rotation-7>div:nth-of-type(5) {
  animation-delay: 4s;
}
.loading-rotation-7>div:nth-of-type(6) {
  animation-delay: 2s;
}
.loading-rotation-7>div:nth-of-type(7) {
  animation-delay: 0s;
}

.loading-rotation-8>div {
  animation-name: loading-rotations-8;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
  animation-duration: 16s;
}

.loading-rotation-8>div:nth-of-type(1) {
  animation-delay: 14s;
}
.loading-rotation-8>div:nth-of-type(2) {
  animation-delay: 12s;
}
.loading-rotation-8>div:nth-of-type(3) {
  animation-delay: 10s;
}
.loading-rotation-8>div:nth-of-type(4) {
  animation-delay: 8s;
}
.loading-rotation-8>div:nth-of-type(5) {
  animation-delay: 6s;
}
.loading-rotation-8>div:nth-of-type(6) {
  animation-delay: 4s;
}
.loading-rotation-8>div:nth-of-type(7) {
  animation-delay: 2s;
}
.loading-rotation-8>div:nth-of-type(8) {
  animation-delay: 0s;
}
`
