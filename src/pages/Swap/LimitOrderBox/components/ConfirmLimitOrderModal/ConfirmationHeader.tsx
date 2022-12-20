import { CurrencyAmount, TokenAmount } from '@swapr/sdk'

import styled from 'styled-components'

import { ReactComponent as ArrowDown } from '../../../../../assets/images/bold-arrow-down.svg'
import { CurrencyLogo } from '../../../../../components/CurrencyLogo'

export type HeaderData = {
  fiatValueInput: CurrencyAmount | null
  fiatValueOutput: CurrencyAmount | null
  buyToken: TokenAmount
  sellToken: TokenAmount
}

export const ConfirmationHeader = ({
  fiatValueInput,
  fiatValueOutput,

  buyToken,
  sellToken,
}: HeaderData) => {
  const fiatInput = fiatValueInput && fiatValueInput.toFixed(2, { groupSeparator: ',' })
  const fiatOutput = fiatValueOutput && fiatValueOutput.toFixed(2, { groupSeparator: ',' })

  return (
    <Wrapper>
      <CurrencyAmountContainer>
        <CurrencyLogoInfo>
          <LeftSideText>YOU SWAP</LeftSideText>
          <LogoWithText>
            <CurrencySymbol>{sellToken.currency.symbol}</CurrencySymbol>{' '}
            <CurrencyLogo size="20px" currency={sellToken.currency} />
          </LogoWithText>
        </CurrencyLogoInfo>
        <AmountWithUsd>
          <Amount>{sellToken.toFixed(3)}</Amount>
          {fiatInput && <AmountInUSD>${fiatInput}</AmountInUSD>}
        </AmountWithUsd>
      </CurrencyAmountContainer>
      <StyledArrow />
      <CurrencyAmountContainer>
        <CurrencyLogoInfo>
          <LeftSideText>YOU RECIEVE</LeftSideText>
          <LogoWithText>
            <CurrencySymbol>{buyToken.currency.symbol}</CurrencySymbol>{' '}
            <CurrencyLogo size="20px" currency={buyToken.currency} />
          </LogoWithText>
        </CurrencyLogoInfo>
        <AmountWithUsd>
          <Amount>{buyToken.toFixed(3)}</Amount>
          {fiatOutput && <AmountInUSD>${fiatOutput}</AmountInUSD>}
        </AmountWithUsd>
      </CurrencyAmountContainer>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
`
const CurrencyAmountContainer = styled.div`
  display: flex;
  padding: 0 19px;
  align-items: center;
  justify-content: space-between;
  height: 82px;
  border: 1px solid ${({ theme }) => theme.bg3};
  border-radius: 8.72381px;
`
const CurrencySymbol = styled.div`
  font-weight: 600;
  font-size: 20px;
  line-height: 24px;
`
const LogoWithText = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`
const CurrencyLogoInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`
const LeftSideText = styled.div`
  font-weight: 600;
  font-size: 10px;
  line-height: 12px;
  letter-spacing: 0.08em;
  color: #8780bf;
`
const AmountWithUsd = styled.div`
  display: flex;
  flex-direction: column;
  align-items: end;
  gap: 4px;
`
const Amount = styled.div`
  font-weight: 600;
  font-size: 28px;
  line-height: 34px;
`
const AmountInUSD = styled.div`
  font-weight: 600;
  font-size: 10px;
  line-height: 12px;
  letter-spacing: 0.08em;
  color: #8780bf;
`
const StyledArrow = styled(ArrowDown)`
  width: 100%;
  margin: 4px 0;
`
