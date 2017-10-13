import { get } from 'lodash/fp'
import getMe from './getMe'

export default function (state, props) {
  const currentUser = getMe(state)
  return state.currentCommunity ||
    (currentUser && get('id', currentUser.lastViewedCommunity()))
}
