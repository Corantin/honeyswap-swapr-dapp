import type { Trade } from '@honeyswapr/sdk'

export type SwapData = {
  showConfirm: boolean
  tradeToConfirm: Trade | undefined
  attemptingTxn: boolean
  swapErrorMessage: string | undefined
  txHash: string | undefined
}

export enum CoWTradeState {
  UNKNOWN, // default
  WRAP,
  APPROVAL,
  SWAP,
}
