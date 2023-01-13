import { ChainId, TokenAmount } from '@swapr/sdk'

import { formatUnits } from 'ethers/lib/utils'
import React, { useLayoutEffect, useRef, useState } from 'react'

import { useActiveWeb3React } from '../../../../hooks/index'
import { useHigherUSDValue } from '../../../../hooks/useUSDValue'
import { InputFocus, OrderExpiresInUnit, SerializableLimitOrder } from '../interfaces'
import { getInitialState } from '../utils'
import { LimitOrderFormContext } from './LimitOrderFormContext'

export function LimitOrderFormBaseConditionalProvider({
  account,
  chainId,
  children,
}: {
  chainId: ChainId
  account: string
  children: React.ReactNode
}) {
  // Get the initial values and set the state
  let initialState = useRef(getInitialState(chainId, account)).current
  // Default expiry time set to 3 days
  const [expiresInUnit, setExpiresInUnit] = useState(OrderExpiresInUnit.Days)
  const [expiresIn, setExpiresIn] = useState(3)

  // State holding the sell and buy currency amounts
  const [sellTokenAmount, setSellTokenAmount] = useState<TokenAmount>(initialState.sellTokenAmount)
  const [buyTokenAmount, setBuyTokenAmount] = useState<TokenAmount>(initialState.buyTokenAmount)

  // Final limit order to be sent to the internal API
  const [limitOrder, setLimitOrder] = useState<SerializableLimitOrder>(initialState.limitOrder)

  const [inputFocus, setInputFocus] = useState<InputFocus>(InputFocus.SELL)

  // Display formatted sell/buy amounts
  const [formattedSellAmount, setFormattedSellAmount] = useState<string>(
    parseFloat(formatUnits(initialState.limitOrder.sellAmount, initialState.sellTokenAmount.currency.decimals)).toFixed(
      6
    )
  )
  const [formattedBuyAmount, setFormattedBuyAmount] = useState<string>('0')
  // Display formatted sell/buy amounts
  const [formattedLimitPrice, setFormattedLimitPrice] = useState<string>('0')

  const { fiatValueInput, fiatValueOutput, isFallbackFiatValueInput, isFallbackFiatValueOutput } = useHigherUSDValue({
    inputCurrencyAmount: sellTokenAmount,
    outputCurrencyAmount: buyTokenAmount,
  })

  useLayoutEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    initialState = getInitialState(chainId, account)
    setSellTokenAmount(initialState.sellTokenAmount)
    setBuyTokenAmount(initialState.buyTokenAmount)
    setLimitOrder(initialState.limitOrder)
  }, [chainId])

  return (
    <LimitOrderFormContext.Provider
      value={{
        limitOrder,
        setLimitOrder,
        buyTokenAmount,
        setBuyTokenAmount,
        sellTokenAmount,
        setSellTokenAmount,
        formattedLimitPrice,
        setFormattedLimitPrice,
        formattedBuyAmount,
        setFormattedBuyAmount,
        formattedSellAmount,
        setFormattedSellAmount,
        expiresIn,
        setExpiresIn,
        expiresInUnit,
        setExpiresInUnit,
        inputFocus,
        setInputFocus,
        fiatValueInput,
        fiatValueOutput,
        isFallbackFiatValueInput,
        isFallbackFiatValueOutput,
      }}
    >
      {children}
    </LimitOrderFormContext.Provider>
  )
}

export const LimitOrderFromProvider = ({ children }: { children: React.ReactNode }) => {
  const { chainId, account } = useActiveWeb3React()

  if (!chainId || !account) return <>{children}</>

  return (
    <LimitOrderFormBaseConditionalProvider chainId={chainId} account={account}>
      {children}
    </LimitOrderFormBaseConditionalProvider>
  )
}
