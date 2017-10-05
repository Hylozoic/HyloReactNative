import { get } from 'lodash/fp'

export default function (param, props) {
  const params = get('navigation.state.params', props)
  return get(param, params)
}
