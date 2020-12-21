import { get } from 'lodash/fp'

export default function (state) {
  return get('networkId', state.session)
}
