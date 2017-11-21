import { SELECT_COMMUNITY, SELECT_NETWORK } from 'store/constants'
import { ALL_COMMUNITIES_ID } from '../../../store/models/Community'

export default function reducer (state = {isVisible: true}, action) {
  if (action.type === SELECT_COMMUNITY) {
    return {isVisible: action.payload !== ALL_COMMUNITIES_ID}
  }
  if (action.type === SELECT_NETWORK) {
    return {isVisible: false}
  }
  return state
}
