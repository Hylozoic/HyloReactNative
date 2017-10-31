import {
  SELECT_COMMUNITY,
  SELECT_NETWORK
} from 'store/constants'

export default function currentNetworkAndCommunity (state = {}, action) {
  const { error, type, payload } = action

  if (error) {
    return state
  }

  switch (type) {
    case SELECT_COMMUNITY:
      return {
        ...state,
        communityId: payload,
        networkId: null
      }
    case SELECT_NETWORK:
      return {
        ...state,
        communityId: null,
        networkId: payload
      }
  }

  return state
}
