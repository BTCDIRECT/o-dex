import { useEffect, useMemo } from 'react'
import { TokenDetails } from 'types'
import useSafeState from './useSafeState'
import { getTokens, subscribeToTokenList } from 'services'
import { EMPTY_ARRAY } from 'const'

export interface UseTokenListParams {
  networkId?: number
  excludeDeprecated?: boolean
}

export const useTokenList = ({ networkId, excludeDeprecated }: UseTokenListParams = {}): TokenDetails[] => {
  // sync get tokenList
  const unfilteredTokens = networkId === undefined ? EMPTY_ARRAY : getTokens(networkId)

  const tokens = useMemo(() => {
    if (!excludeDeprecated) return unfilteredTokens

    return unfilteredTokens.filter(token => !token.disabled)
  }, [excludeDeprecated, unfilteredTokens])

  // force update with a new value each time
  const [, forceUpdate] = useSafeState({})

  useEffect(() => {
    return subscribeToTokenList(() => forceUpdate({}))
  }, [forceUpdate])

  return tokens
}
