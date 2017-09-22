import { CHANGE_COMMUNITY } from 'store/constants'
import { FETCH_CURRENT_USER } from '../actions/fetchCurrentUser'
import { maxBy } from 'lodash'

export default function currentCommunity (state = null, action) {
  const { error, type, payload } = action

  if (type === CHANGE_COMMUNITY) return payload

  if (type === FETCH_CURRENT_USER && !error) {
    const lastViewedMembership = maxBy(payload.data.me.memberships,
      ms => new Date(ms.lastViewedAt))
    if (lastViewedMembership) {
      return lastViewedMembership.community.id
    } else {
      return payload
    }
  }

  return state
}
