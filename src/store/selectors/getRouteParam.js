import { get } from 'lodash/fp'

export default function getRouteParam (key, route) {
  if (!route) throw new Error('`route` param is empty')

  return get(`params.${key}`, route)
}
