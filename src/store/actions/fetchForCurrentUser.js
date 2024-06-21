import { get } from 'lodash/fp'
import { FETCH_FOR_CURRENT_USER } from 'store/constants'
import MeQuery from 'graphql/queries/MeQuery'

export default function fetchForCurrentUser () { // SEEMINGLY REDUNDANT, NO LONGER IN USE?
  return {
    type: FETCH_FOR_CURRENT_USER,
    graphql: {
      query: MeQuery
    },
    meta: {
      afterInteractions: true,
      extractModel: [
        {
          getRoot: get('me'),
          modelName: 'Me'
        }
      ]
    }
  }
}
