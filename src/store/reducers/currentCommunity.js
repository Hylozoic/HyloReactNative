import { CHANGE_COMMUNITY } from 'store/constants'

export default function currentCommunity (state = null, action) {
  if (action.type === CHANGE_COMMUNITY) return action.payload
  return state
}
