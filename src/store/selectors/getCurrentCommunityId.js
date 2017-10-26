import { get } from 'lodash/fp'
import getMe from './getMe'

export default function (state, props) {
  const currentUser = getMe(state)
  return get('communityId', state.currentNetworkAndCommunity) ||
    (currentUser && get('id', currentUser.lastViewedCommunity()))
}
