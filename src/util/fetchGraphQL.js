import { getSessionCookie } from './session'
import fetchJSON from './fetchJSON'

export default function fetchGraphQL (query) {
  return getSessionCookie()
    .then(cookie => fetchJSON('/noo/graphql', { query }, { cookie, method: 'POST' }))
    .then(json => json.data)
}
