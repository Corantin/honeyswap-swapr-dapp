import { Currency } from '@honeyswapr/sdk'

export interface ImportTokenProps {
  onBack: () => void
  onDismiss: () => void
  onCurrencySelect?: (currency: Currency) => void
}
