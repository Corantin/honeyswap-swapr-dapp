import { transparentize } from 'polished'
import styled from 'styled-components'

import { ButtonPrimary } from '../../../components/Button'
import { RowBetween } from '../../../components/Row'
import { ChainLabel } from '../../../constants'
import { useActiveWeb3React } from '../../../hooks'

interface NetworkSwitcherProps {
  sendToId: number
  onCollectClick: () => void
  onSwitchClick: () => void
}

export const NetworkSwitcher = ({ sendToId, onCollectClick, onSwitchClick }: NetworkSwitcherProps) => {
  const { chainId } = useActiveWeb3React()
  if (!chainId) return null

  return (
    <>
      <RowBetween>
        <SwitchButton onClick={onSwitchClick} disabled={chainId === sendToId}>
          Switch to {ChainLabel[sendToId]}
        </SwitchButton>
        <CollectButton onClick={onCollectClick} disabled={chainId !== sendToId}>
          Collect
        </CollectButton>
      </RowBetween>
      <Row>
        <Number className={chainId === sendToId ? 'active' : ''}>1</Number>
        <Number className={chainId === sendToId ? '' : 'disabled'}>2</Number>
      </Row>
    </>
  )
}

const SwitchButton = styled(ButtonPrimary)`
  height: 58px;

  &:disabled {
    background: rgba(14, 159, 110, 0.2);
    color: ${({ theme }) => transparentize(0.6, theme.green2)};
  }
`

const CollectButton = styled(ButtonPrimary)`
  height: 58px;
  margin-left: 16px;

  &:disabled {
    background-color: ${({ theme }) => theme.primary1};
    color: ${({ theme }) => theme.white};
    opacity: 0.3;
  }
`

const Row = styled(RowBetween)`
  position: relative;
  max-width: 247px;
  margin: 24px auto 10px;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    height: 1px;
    transform: translateY(-50%);
    background: linear-gradient(-90deg, #e3f217 -3.41%, rgba(209, 242, 23, 0.2) 29.26%, rgba(220, 242, 23, 0.6) 29.26%);
    z-index: -1;
  }

  &.active::before {
    background: linear-gradient(90deg, #9f7d0e 0.85%, #f2ee17 101.42%);
  }
`

const Number = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 22px;
  width: 22px;
  background-color: ${({ theme }) => theme.primary1};
  border-radius: 50%;
  color: ${({ theme }) => theme.white};
  font-weight: 500;
  font-size: 12px;
  line-height: 12px;

  &.active {
    background: #342d16;
  }
  &.disabled {
    background-color: ${({ theme }) => theme.yellow5};
    color: ${({ theme }) => transparentize(0.28, theme.purpleBase)};
  }
`
