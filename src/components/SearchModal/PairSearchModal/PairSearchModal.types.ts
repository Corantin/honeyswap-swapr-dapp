import { Pair } from '@honeyswapr/sdk'

export interface PairSearchModalProps {
  isOpen: boolean
  onDismiss: () => void
  selectedPair?: Pair | null
  onPairSelect: (pair: Pair) => void
  filterPairs?: (pair: Pair) => boolean
}
