import { ChainId } from '@honeyswapr/sdk'

import { Placement } from '@popperjs/core'
import { ReactNode, RefObject } from 'react'

export interface NetworkSwitcherProps {
  children?: ReactNode
  show: boolean
  onOuterClick: () => void
  networksList: NetworksList[]
  placement?: Placement
  showWalletConnector?: boolean
  parentRef?: RefObject<HTMLElement>
}

export type NetworkOptionsPreset = {
  chainId: ChainId
  name: string
  logoSrc: string
  color: string
  tag?: NetworkSwitcherTags
}

export type NetworkOptions = {
  preset: NetworkOptionsPreset
  active?: boolean
  disabled?: boolean
  onClick?: any
  connected?: boolean
}

export type NetworksList = {
  tag?: NetworkSwitcherTags
  networks: NetworkOptions[]
}

export enum NetworkSwitcherTags {
  TESTNETS = 'testnets',
  COMING_SOON = 'coming soon',
}
