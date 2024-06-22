import { get } from 'lodash/fp'
import { useRoute } from '@react-navigation/native'

export default function useRouteParam (key) {
  const route = useRoute()

  if (!route) throw new Error('`route` param is empty')

  return get(`params.${key}`, route)
}
