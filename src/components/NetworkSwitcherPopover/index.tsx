import { ChainId } from '@swapr/sdk'

import { Placement } from '@popperjs/core'
import { useWeb3React } from '@web3-react/core'
import React, { ReactNode } from 'react'

import { useNetworkSwitch } from '../../hooks/useNetworkSwitch'
import { ApplicationModal } from '../../state/application/actions'
import { useCloseModals, useModalOpen } from '../../state/application/hooks'
import { createNetworksList } from '../../utils/networksList'
import { networkOptionsPreset, NetworkSwitcher, NetworkSwitcherTags } from '../NetworkSwitcher'

interface NetworkSwitcherPopoverProps {
  children: ReactNode
  modal: ApplicationModal
  placement?: Placement
}

export default function NetworkSwitcherPopover({ children, modal, placement }: NetworkSwitcherPopoverProps) {
  const closeModals = useCloseModals()
  const { connector, chainId: activeChainId, account } = useWeb3React()
  const networkSwitcherPopoverOpen = useModalOpen(modal)
  // TODO
  const unsupportedChainIdError = false

  const { selectNetwork } = useNetworkSwitch({
    onSelectNetworkCallback: closeModals,
  })

  // TODO
  const isNetworkDisabled = (chainId: ChainId) => {
    return false
  }

  const networkList = createNetworksList({
    networkOptionsPreset,
    onNetworkChange: selectNetwork,
    isNetworkDisabled,
    selectedNetworkChainId: activeChainId ? activeChainId : -1,
    activeChainId: account ? activeChainId : -1,
    ignoreTags: [NetworkSwitcherTags.COMING_SOON],
  })

  return (
    <NetworkSwitcher
      networksList={networkList}
      show={networkSwitcherPopoverOpen}
      onOuterClick={closeModals}
      placement={placement}
    >
      {children}
    </NetworkSwitcher>
  )
}
