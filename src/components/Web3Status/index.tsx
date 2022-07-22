import { CoinbaseWallet } from '@web3-react/coinbase-wallet'
import { MetaMask } from '@web3-react/metamask'
import { Network } from '@web3-react/network'
import { Connector } from '@web3-react/types'
import { WalletConnect } from '@web3-react/walletconnect' // TODO pack all import into one
import { getConnection } from 'connectors/utils'
import { useWeb3ReactCore } from 'hooks/useWeb3ReactCore'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { WalletType } from '../../constants'
import { useENSAvatar } from '../../hooks/useENSAvatar'
import useENSName from '../../hooks/useENSName'
import { useIsMobileByMedia } from '../../hooks/useIsMobileByMedia'
import { ApplicationModal } from '../../state/application/actions'
import {
  useCloseModals,
  useModalOpen,
  useNetworkSwitcherPopoverToggle,
  useOpenModal,
  useWalletSwitcherPopoverToggle,
} from '../../state/application/hooks'
import { isTransactionRecent, useAllTransactions } from '../../state/transactions/hooks'
import { TransactionDetails } from '../../state/transactions/reducer'
import { TriangleIcon } from '../Icons'
import NetworkSwitcherPopover from '../NetworkSwitcherPopover'
import Row from '../Row'
import WalletModal from '../WalletModal'
import { AccountStatus } from './AccountStatus'
import { ConnectWalletPopover } from './ConnectWalletPopover'

const SwitchNetworkButton = styled.button`
  display: flex;
  align-items: center;
  height: 29px;
  padding: 8px 14px;
  margin-left: 8px;
  background-color: ${({ theme }) => theme.primary1};
  color: ${({ theme }) => theme.text1};
  border-radius: 12px;
  text-transform: uppercase;
  font-weight: bold;
  font-size: 11px;
  line-height: 12px;
  letter-spacing: 0.08em;
  border: none;
  cursor: ${({ disabled }) => (disabled ? 'text' : 'pointer')};
`

export const Button = styled.button`
  height: 29px;
  padding: 10.5px 14px;
  margin: 0 0 0 auto;
  background-color: ${({ theme }) => theme.primary1};
  color: ${({ theme }) => theme.text1};
  border-radius: 12px;
  text-transform: uppercase;
  font-weight: bold;
  font-size: 12px;
  line-height: 10px;
  letter-spacing: 0.08em;
  border: none;
  outline: none;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  cursor: pointer;
`

// we want the latest one to come first, so return negative if a is after b
function newTransactionsFirst(a: TransactionDetails, b: TransactionDetails) {
  return b.addedTime - a.addedTime
}

export enum ModalView {
  Pending,
  Account,
}

export default function Web3Status() {
  const { account, connector, chainId, ENSName, isActive } = useWeb3ReactCore()
  // const { ENSName } = useENSName(account ?? undefined)
  const { avatar: ensAvatar } = useENSAvatar(ENSName)
  const allTransactions = useAllTransactions()

  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions)
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
  }, [allTransactions])

  const pending = sortedRecentTransactions.filter(tx => !tx.receipt).map(tx => tx.hash)
  const confirmed = sortedRecentTransactions.filter(tx => tx.receipt).map(tx => tx.hash)

  const [modal, setModal] = useState<ModalView | null>(null)

  const [pendingError, setPendingError] = useState<boolean>()
  const [pendingWallet, setPendingWallet] = useState<Connector | undefined>()

  const toggleNetworkSwitcherPopover = useNetworkSwitcherPopoverToggle()
  const openUnsupportedNetworkModal = useOpenModal(ApplicationModal.UNSUPPORTED_NETWORK)

  console.log('wallet', pendingWallet, connector, isActive, account)
  //TODO: improve tryActivation funciton
  const tryActivation = useCallback(
    async (connector: Connector) => {
      // TODO use for updates
      // const connectionType = getConnection(connector).type
      if (!connector) return

      try {
        console.log('aktywacja', pendingWallet, connector, isActive, account)
        setPendingWallet(connector)
        setModal(ModalView.Pending)
        setPendingError(undefined)

        await connector.activate()

        // dispatch(updateSelectedWallet({ wallet: connectionType }))
      } catch (error) {
        console.debug(`web3-react connection error: ${error}`)
        // dispatch(updateConnectionError({ connectionType, error: error.message }))
        setPendingError(true)
      }
    },
    [account, isActive, pendingWallet]
  )

  const tryDeactivation = useCallback(async (connector: Connector, account: string | undefined) => {
    if (!account) return
    if (connector?.deactivate) {
      void connector.deactivate()
    } else {
      void connector.resetState()
    }
  }, [])

  const toggleWalletSwitcherPopover = useWalletSwitcherPopoverToggle()
  const { t } = useTranslation()
  const mobileByMedia = useIsMobileByMedia()
  // const [isUnsupportedNetwork, setUnsupportedNetwork] = useState(false)
  // const isUnsupportedNetworkModal = useModalOpen(ApplicationModal.UNSUPPORTED_NETWORK)
  // const closeModals = useCloseModals()

  // // // TODO unsupported chain id
  // // const unsupportedChainIdError = false

  // // useEffect(() => {
  // //   if (!isUnsupportedNetworkModal && !isUnsupportedNetwork && unsupportedChainIdError) {
  // //     setUnsupportedNetwork(true)
  // //     openUnsupportedNetworkModal()
  // //   } else if (!isUnsupportedNetworkModal && isUnsupportedNetwork && !unsupportedChainIdError) {
  // //     setUnsupportedNetwork(false)
  // //   } else if (isUnsupportedNetworkModal && !unsupportedChainIdError) {
  // //     closeModals()
  // //   }
  // // }, [
  // //   isUnsupportedNetwork,
  // //   openUnsupportedNetworkModal,
  // //   isUnsupportedNetworkModal,
  // //   unsupportedChainIdError,
  // //   closeModals,
  // // ])

  // TODO UNSUPPORTED NETWORK
  // const clickHandler = useCallback(() => {
  //   toggleNetworkSwitcherPopover()
  // }, [toggleNetworkSwitcherPopover])

  // if (pendingError) {
  //   return (
  //     <NetworkSwitcherPopover modal={ApplicationModal.NETWORK_SWITCHER}>
  //       <SwitchNetworkButton onClick={clickHandler}>
  //         Switch network
  //         <TriangleIcon />
  //       </SwitchNetworkButton>
  //     </NetworkSwitcherPopover>
  //   )
  // }

  return (
    <>
      {/* TODO: pass disconnect function */}
      <ConnectWalletPopover setModal={setModal} tryActivation={tryActivation} tryDeactivation={tryDeactivation}>
        <Row alignItems="center" justifyContent="flex-end">
          {chainId && !account && (
            <Button id="connect-wallet" onClick={toggleWalletSwitcherPopover}>
              {mobileByMedia ? 'Connect' : t('Connect wallet')}
            </Button>
          )}
          <AccountStatus
            pendingTransactions={pending}
            ENSName={ENSName ?? undefined}
            account={account}
            connector={connector}
            networkConnectorChainId={chainId}
            onAddressClick={() => setModal(ModalView.Account)}
            avatar={ensAvatar ?? undefined}
          />
        </Row>
      </ConnectWalletPopover>
      {/* TODO: type it */}
      <WalletModal
        modal={modal}
        setModal={setModal}
        ENSName={ENSName ?? undefined}
        pendingTransactions={pending}
        confirmedTransactions={confirmed}
        setPendingError={setPendingError}
        pendingWallet={pendingWallet}
        pendingError={pendingError}
        tryActivation={tryActivation}
      />
    </>
  )
}
