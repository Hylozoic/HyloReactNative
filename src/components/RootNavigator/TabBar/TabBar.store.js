import { CHANGE_COMMUNITY } from 'store/constants'
import { ALL_COMMUNITIES_ID } from '../../../store/models/Community'

export default function reducer (state = {isVisible: true}, action) {
  if (action.type === CHANGE_COMMUNITY) {
    return {isVisible: action.payload !== ALL_COMMUNITIES_ID}
  }

  return state
}
