import { ReactNode, useState } from 'react'

import { useDefaultsFromURLSearch, useDerivedSwapInfo } from '../../../state/swap/hooks'
import { PlatformOverride, SwapContext } from './SwapContext'

export const SwapProvider = ({ children }: { children: ReactNode }) => {
  const [platformOverride, setPlatformOverride] = useState<PlatformOverride>(null)

  useDefaultsFromURLSearch()

  const { trade, allPlatformTrades, currencyBalances, parsedAmount, currencies, inputError, loading } =
    useDerivedSwapInfo(platformOverride || undefined)

  return (
    <SwapContext.Provider
      value={{
        trade,
        allPlatformTrades,
        currencyBalances,
        parsedAmount,
        currencies,
        inputError,
        loading,
        platformOverride,
        setPlatformOverride,
      }}
    >
      {children}
    </SwapContext.Provider>
  )
}
