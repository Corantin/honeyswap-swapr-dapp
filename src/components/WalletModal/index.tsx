import { Connector } from '@web3-react/types'
import { isChainSupportedByConnector } from 'connectors/utils'
import { useWeb3ReactCore } from 'hooks/useWeb3ReactCore'
import React, { useCallback, useEffect } from 'react'
import { AlertTriangle } from 'react-feather'
import styled from 'styled-components'

import { ReactComponent as Close } from '../../assets/images/x.svg'
import DxDao from '../../assets/svg/dxdao.svg'
import { ConnectorType } from '../../constants'
import usePrevious from '../../hooks/usePrevious'
import { useWalletSwitcherPopoverToggle } from '../../state/application/hooks'
import { TYPE } from '../../theme'
import AccountDetails from '../AccountDetails'
import Modal from '../Modal'
import { AutoRow } from '../Row'
import { ModalView } from '../Web3Status'
import PendingView from './PendingView'

const CloseIcon = styled.div`
  position: absolute;
  right: 1rem;
  top: 14px;
  cursor: pointer;
`

const CloseColor = styled(Close)`
  width: 16px;
  height: 16px;
  color: ${({ theme }) => theme.text3};
`

const StyledWarningIcon = styled(AlertTriangle)`
  stroke: ${({ theme }) => theme.text3};
`

const Wrapper = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap}
  margin: 0;
  padding: 0;
  width: 100%;
`

const HeaderRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap};
  padding: 1rem 1.125rem 0 1.125rem;
  font-weight: 500;
  color: ${props => (props.color === 'blue' ? ({ theme }) => theme.primary1 : 'inherit')};
  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 1rem;
  `};
`

const ContentWrapper = styled.div`
  padding: 16px 18px 32px 16px;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;

  ${({ theme }) => theme.mediaWidth.upToMedium`padding: 1rem`};
`

const UpperSection = styled.div`
  position: relative;
  background-color: ${({ theme }) => theme.bg1And2};

  h5 {
    margin: 0;
    margin-bottom: 0.5rem;
    font-size: 1rem;
    font-weight: 400;
  }

  h5:last-child {
    margin-bottom: 0px;
  }

  h4 {
    margin-top: 0;
    font-weight: 500;
  }
`

const Blurb = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.bg1};
  height: 76px;
  position: relative;
  overflow: hidden;

  img {
    position: absolute;
    width: 80%;
  }
`

const HoverText = styled.div`
  :hover {
    cursor: pointer;
  }
`

interface WalletModalProps {
  modal: ModalView | null
  setModal: (modal: ModalView | null) => void
  pendingTransactions: string[]
  confirmedTransactions: string[]
  ENSName?: string
  tryActivation: (connector: Connector, id?: ConnectorType) => void
  connectorError: boolean | undefined
  pendingConnector: Connector
}

export default function WalletModal({
  pendingTransactions,
  confirmedTransactions,
  ENSName,
  modal,
  setModal,
  tryActivation,
  connectorError,
  pendingConnector,
}: WalletModalProps) {
  const { account, connector, isActive, chainId } = useWeb3ReactCore()

  const closeModal = useCallback(() => setModal(null), [setModal])

  const isModalVisible = modal !== null
  const isChainSupported = isChainSupportedByConnector(pendingConnector, chainId)

  const previousAccount = usePrevious(account)

  // close on connection, when logged out before
  useEffect(() => {
    if (account && !previousAccount && isModalVisible) {
      closeModal()
    }
  }, [account, previousAccount, closeModal, isModalVisible])

  // close on wallet change
  useEffect(() => {
    if (account && previousAccount && previousAccount !== account && isModalVisible) {
      closeModal()
    }
  }, [account, previousAccount, closeModal, isModalVisible])

  const activePrevious = usePrevious(isActive)
  const connectorPrevious = usePrevious(connector)
  useEffect(() => {
    if (
      !!modal &&
      ((isActive && !activePrevious) || (connector && connector !== connectorPrevious && !connectorError))
    ) {
      setModal(null)
    }
  }, [setModal, connector, modal, activePrevious, connectorPrevious, isActive, connectorError])

  const toggleWalletSwitcherPopover = useWalletSwitcherPopoverToggle()
  const onBackButtonClick = () => {
    setModal(null)
    toggleWalletSwitcherPopover()
  }

  function getModalContent() {
    if (!isChainSupported) {
      return (
        <UpperSection>
          <CloseIcon onClick={closeModal}>
            <CloseColor />
          </CloseIcon>
          <HeaderRow>
            <AutoRow gap="6px">
              <StyledWarningIcon size="20px" />
              <TYPE.main fontSize="16px" lineHeight="22px" color={'text3'}>
                {isChainSupported ? 'Error connecting' : 'Wrong Network'}
              </TYPE.main>
            </AutoRow>
          </HeaderRow>
          <ContentWrapper>
            <TYPE.yellow color="text4">
              <h5>
                {isChainSupported
                  ? 'Error connecting. Try refreshing the page.'
                  : 'Please connect to the appropriate network.'}
              </h5>
            </TYPE.yellow>
          </ContentWrapper>
        </UpperSection>
      )
    }
    if (account && modal === ModalView.Account) {
      return (
        <AccountDetails
          toggleWalletModal={closeModal}
          pendingTransactions={pendingTransactions}
          confirmedTransactions={confirmedTransactions}
          ENSName={ENSName}
          openOptions={() => {
            setModal(null)
            toggleWalletSwitcherPopover()
          }}
        />
      )
    }
    return (
      <UpperSection>
        <CloseIcon onClick={closeModal}>
          <CloseColor />
        </CloseIcon>
        {modal !== ModalView.Account ? (
          <HeaderRow color="blue">
            <HoverText onClick={onBackButtonClick}>
              <TYPE.body color="text4" fontWeight={500} fontSize="20px" lineHeight="24px" letterSpacing="-0.01em">
                Back
              </TYPE.body>
            </HoverText>
          </HeaderRow>
        ) : (
          <HeaderRow>
            <TYPE.body fontWeight={500} fontSize={20} color="text4">
              Connect to a wallet
            </TYPE.body>
          </HeaderRow>
        )}
        <ContentWrapper>
          <PendingView connector={pendingConnector} error={connectorError} tryActivation={tryActivation} />
        </ContentWrapper>
        <Blurb as="a" href="https://dxdao.eth.limo/" rel="noopener noreferrer" target="_blank">
          <TYPE.body fontWeight={700} fontSize="10px" color="text1" letterSpacing="3px" marginBottom="8px">
            A DXDAO PRODUCT
          </TYPE.body>
          <TYPE.body fontWeight={600} fontSize="8px" color="text5" letterSpacing="2px">
            DXDAO.ETH
          </TYPE.body>
          <img src={DxDao} alt="dxdao" />
        </Blurb>
      </UpperSection>
    )
  }

  return (
    <Modal isOpen={isModalVisible} onDismiss={closeModal} minHeight={false} maxHeight={90}>
      <Wrapper>{getModalContent()}</Wrapper>
    </Modal>
  )
}
