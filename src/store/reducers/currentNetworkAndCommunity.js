import {
  SELECT_COMMUNITY,
  SELECT_NETWORK
} from 'store/constants'
import { FETCH_CURRENT_USER } from '../actions/fetchCurrentUser'
import { maxBy } from 'lodash'

export default function currentNetworkAndCommunity (state = null, action) {
  const { error, type, payload } = action

  if (type === SELECT_COMMUNITY) {
    return {
      ...state,
      communityId: payload,
      networkId: null
    }
  }

  if (type === SELECT_NETWORK) {
    return {
      ...state,
      communityId: null,
      networkId: payload
    }
  }

  if (type === FETCH_CURRENT_USER && !error) {
    const lastViewedMembership = maxBy(payload.data.me.memberships,
      ms => new Date(ms.lastViewedAt))
    if (lastViewedMembership) {
      return lastViewedMembership.community.id
    } else {
      return state
    }
  }

  return state
}
