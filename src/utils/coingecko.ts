import { ChainId, Currency, Trade } from '@swapr/sdk'

import { queryClient } from '..'

interface PriceInformation {
  token: string
  amount: string
  percentageAmountChange24h: number
  isIncome24h: boolean
}

// Defaults
const API_NAME = 'Coingecko'
const API_BASE_URL = 'https://api.coingecko.com/api'
const API_VERSION = 'v3'
const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
}

function _getApiBaseUrl(chainId: ChainId): string {
  const baseUrl = API_BASE_URL

  if (!baseUrl) {
    throw new Error(`Unsupported Network. The ${API_NAME} API is not deployed in the Network ${chainId}`)
  } else {
    return baseUrl + '/' + API_VERSION
  }
}

const COINGECKO_ASSET_PLATFORM: { [chainId in ChainId]: string | null } = {
  [ChainId.MAINNET]: 'ethereum',
  [ChainId.RINKEBY]: null,
  [ChainId.ARBITRUM_ONE]: 'arbitrum-one',
  [ChainId.ARBITRUM_RINKEBY]: null,
  [ChainId.ARBITRUM_GOERLI]: null,
  [ChainId.XDAI]: 'xdai',
  [ChainId.POLYGON]: 'polygon-pos',
  [ChainId.GOERLI]: null,
  [ChainId.OPTIMISM_MAINNET]: 'optimistic-ethereum',
  [ChainId.OPTIMISM_GOERLI]: null,
  [ChainId.BSC_MAINNET]: 'binance-smart-chain',
  [ChainId.BSC_TESTNET]: null,
  [ChainId.ZKSYNC_Era_MAINNET]: null,
  [ChainId.ZKSYNC_Era_TESTNET]: null,
}

export const COINGECKO_NATIVE_CURRENCY: Record<number, string> = {
  [ChainId.MAINNET]: 'ethereum',
  [ChainId.ARBITRUM_ONE]: 'ethereum',
  [ChainId.XDAI]: 'xdai',
  [ChainId.POLYGON]: 'matic-network',
  [ChainId.OPTIMISM_MAINNET]: 'ethereum',
  [ChainId.BSC_MAINNET]: 'binancecoin',
}

function _fetch(chainId: ChainId, url: string, method: 'GET' | 'POST' | 'DELETE', data?: any): Promise<Response> {
  const baseUrl = _getApiBaseUrl(chainId)
  return fetch(baseUrl + url, {
    headers: DEFAULT_HEADERS,
    method,
    body: data !== undefined ? JSON.stringify(data) : data,
  })
}

function _get(chainId: ChainId, url: string): Promise<Response> {
  return _fetch(chainId, url, 'GET')
}

export interface CoinGeckoUsdPriceTokenParams {
  chainId: ChainId
  tokenAddress?: string
}

export interface CoinGeckoUsdPriceCurrencyParams {
  chainId: ChainId
}

export interface CoinGeckoUsdQuote {
  [address: string]: {
    usd: number
    usd_24h_change: number
  }
}

export async function getUSDPriceTokenQuote(params: CoinGeckoUsdPriceTokenParams): Promise<CoinGeckoUsdQuote> {
  const { chainId, tokenAddress } = params

  const assetPlatform = COINGECKO_ASSET_PLATFORM[chainId]
  if (!assetPlatform) {
    // Unsupported asset network
    throw new Error('Unsupported asset network')
  }

  const response = await _get(
    chainId,
    `/simple/token_price/${assetPlatform}?contract_addresses=${tokenAddress}&vs_currencies=usd&include_24hr_change=true`
  ).catch(error => {
    console.error(`Error getting ${API_NAME} USD price quote:`, error)
    throw new Error(error)
  })

  return response.json()
}

export async function getUSDPriceCurrencyQuote(params: CoinGeckoUsdPriceCurrencyParams): Promise<CoinGeckoUsdQuote> {
  const { chainId } = params

  const nativeCurrency = COINGECKO_NATIVE_CURRENCY[chainId]
  if (!nativeCurrency) {
    // Unsupported currency network
    throw new Error('Unsupported currency network')
  }

  const response = await _get(chainId, `/simple/price?ids=${nativeCurrency}&vs_currencies=usd`).catch(error => {
    console.error(`Error getting ${API_NAME} USD price quote:`, error)
    throw new Error(error)
  })

  return response.json()
}

export function toPriceInformation(priceRaw: CoinGeckoUsdQuote): PriceInformation | null {
  // We only receive/want the first key/value pair in the return object
  const token = priceRaw ? Object.keys(priceRaw)[0] : null

  if (!token || !priceRaw?.[token].usd) {
    return null
  }

  const { usd, usd_24h_change } = priceRaw[token]
  return {
    amount: usd.toString(),
    percentageAmountChange24h: usd_24h_change ? Math.abs(usd_24h_change) : 0,
    isIncome24h: usd_24h_change ? usd_24h_change > 0 : false,
    token,
  }
}

export async function getTradeUSDValue(trade: Trade): Promise<string | null> {
  const isNativeCurrency = Currency.isNative(trade.inputAmount.currency)
  const queryKey = isNativeCurrency ? COINGECKO_NATIVE_CURRENCY[trade.chainId] : trade.inputAmount.currency.address

  if (!queryKey) {
    return null
  }

  const getUSDPriceQuote = () =>
    isNativeCurrency
      ? getUSDPriceCurrencyQuote({ chainId: trade.chainId })
      : getUSDPriceTokenQuote({ tokenAddress: trade.inputAmount.currency.address, chainId: trade.chainId })

  const data = await queryClient.fetchQuery(['priceInfo', queryKey], getUSDPriceQuote, { staleTime: Infinity })

  const priceInformation = toPriceInformation(data)

  if (priceInformation !== null && priceInformation.amount !== null) {
    const amount = trade.inputAmount.toSignificant(6)
    const usdValue = (parseFloat(amount) * parseFloat(priceInformation.amount)).toFixed(2)
    return usdValue
  }

  return null
}
