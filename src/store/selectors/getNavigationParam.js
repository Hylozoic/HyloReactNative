import { get } from 'lodash/fp'

export default function getNavigationParam (key, _, props) {
  return get(`route.params.${key}`, props)
}
