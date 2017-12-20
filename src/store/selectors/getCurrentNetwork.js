import getCurrentNetworkId from './getCurrentNetworkId'
import getNetwork from './getNetwork'

export default function (state, props) {
  return getNetwork(state, {id: getCurrentNetworkId(state, props)})
}
