import { Trade, TradeType, UniswapV2Trade } from '@swapr/sdk'

import { isAddress } from 'ethers/lib/utils'
import { useMemo } from 'react'
import { AlertTriangle, ArrowDown } from 'react-feather'
import { Text } from 'rebass'
import { useTheme } from 'styled-components'

import { ButtonPrimary } from '../../../components/Button'
import { AutoColumn } from '../../../components/Column'
import { CurrencyLogo } from '../../../components/CurrencyLogo'
import { RowBetween, RowFixed } from '../../../components/Row'
import { Field } from '../../../state/swap/types'
import { TYPE } from '../../../theme'
import { shortenAddress } from '../../../utils'
import { computeSlippageAdjustedAmounts, computeTradePriceBreakdown, warningSeverity } from '../../../utils/prices'
import { SwapShowAcceptChanges, TruncatedText } from './styles'

export default function SwapModalHeader({
  trade,
  recipient,
  showAcceptChanges,
  onAcceptChanges,
}: {
  trade: Trade
  allowedSlippage: number
  recipient: string | null
  showAcceptChanges: boolean
  onAcceptChanges: () => void
}) {
  const slippageAdjustedAmounts = useMemo(() => computeSlippageAdjustedAmounts(trade), [trade])
  const { priceImpactWithoutFee } = useMemo(() => computeTradePriceBreakdown(trade as UniswapV2Trade), [trade])
  const priceImpactSeverity = warningSeverity(priceImpactWithoutFee)

  const theme = useTheme()

  return (
    <AutoColumn gap={'md'} style={{ marginTop: '20px' }}>
      <RowBetween align="flex-end">
        <RowFixed gap={'0px'}>
          <CurrencyLogo currency={trade.inputAmount.currency} size={'24px'} marginRight={12} />
          <TruncatedText
            fontSize={24}
            fontWeight={500}
            color={showAcceptChanges && trade.tradeType === TradeType.EXACT_OUTPUT ? theme.primary1 : ''}
          >
            {trade.inputAmount.toSignificant(6)}
          </TruncatedText>
        </RowFixed>
        <RowFixed gap={'0px'}>
          <Text fontSize={24} fontWeight={500} style={{ marginLeft: '10px' }}>
            {trade.inputAmount.currency.symbol}
          </Text>
        </RowFixed>
      </RowBetween>
      <RowFixed>
        <ArrowDown size="16" color={theme.text2} style={{ marginLeft: '4px', minWidth: '16px' }} />
      </RowFixed>
      <RowBetween align="flex-end">
        <RowFixed gap={'0px'}>
          <CurrencyLogo currency={trade.outputAmount.currency} size={'24px'} marginRight={12} />
          <TruncatedText
            fontSize={24}
            fontWeight={500}
            color={
              priceImpactSeverity > 2
                ? theme.red1
                : showAcceptChanges && trade.tradeType === TradeType.EXACT_INPUT
                ? theme.primary1
                : ''
            }
          >
            {trade.outputAmount.toSignificant(6)}
          </TruncatedText>
        </RowFixed>
        <RowFixed gap={'0px'}>
          <Text fontSize={24} fontWeight={500} style={{ marginLeft: '10px' }}>
            {trade.outputAmount.currency.symbol}
          </Text>
        </RowFixed>
      </RowBetween>
      {showAcceptChanges ? (
        <SwapShowAcceptChanges justify="flex-start" gap={'0px'}>
          <RowBetween>
            <RowFixed>
              <AlertTriangle size={20} style={{ marginRight: '8px', minWidth: 24 }} />
              <TYPE.Main color={theme.primary1}> Price Updated</TYPE.Main>
            </RowFixed>
            <ButtonPrimary
              style={{
                padding: '.5rem',
                width: 'fit-content',
                fontSize: '0.825rem',
                borderRadius: '12px',
              }}
              onClick={onAcceptChanges}
            >
              Accept
            </ButtonPrimary>
          </RowBetween>
        </SwapShowAcceptChanges>
      ) : null}
      <AutoColumn justify="flex-start" gap="sm" style={{ padding: '12px 0 0 0px' }}>
        {trade.tradeType === TradeType.EXACT_INPUT ? (
          <TYPE.Body fontSize="13px" color="text4" textAlign="left" style={{ width: '100%' }}>
            {`Output is estimated. You will receive at least `}
            <b data-testid="estimated-transaction-output">
              {slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(6)} {trade.outputAmount.currency.symbol}
            </b>
            {' or the transaction will revert.'}
          </TYPE.Body>
        ) : (
          <TYPE.Body fontSize="13px" color="text4" textAlign="left" style={{ width: '100%' }}>
            {`Input is estimated. You will sell at most `}
            <b data-testid="estimated-transaction-output">
              {slippageAdjustedAmounts[Field.INPUT]?.toSignificant(6)} {trade.inputAmount.currency.symbol}
            </b>
            {' or the transaction will revert.'}
          </TYPE.Body>
        )}
      </AutoColumn>
      {recipient !== null ? (
        <AutoColumn justify="flex-start" gap="sm" style={{ padding: '12px 0 0 0px' }}>
          <TYPE.Body fontSize="13px" color="text4">
            Output will be sent to{' '}
            <b title={recipient}>{isAddress(recipient) ? shortenAddress(recipient) : recipient}</b>
          </TYPE.Body>
        </AutoColumn>
      ) : null}
    </AutoColumn>
  )
}
