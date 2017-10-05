import { get, curry } from 'lodash/fp'

export default curry((key, state, props) => {
  return get(['navigation', 'state', 'params', key], props)
})
