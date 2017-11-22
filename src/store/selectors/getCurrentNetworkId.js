import { get } from 'lodash/fp'

export default function (state, props) {
  return get('networkId', state.currentNetworkAndCommunity)
}
