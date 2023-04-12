import { ChainId, Currency } from '@honeyswapr/sdk'

export interface CommonTokensProps {
  chainId?: ChainId
  onCurrencySelect: (currency: Currency) => void
  selectedCurrency?: Currency | null
}
