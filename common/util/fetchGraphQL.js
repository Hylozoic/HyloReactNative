import { API_HOST } from 'react-native-dotenv'
import { getSessionCookie } from './session'

export default function fetchGraphQL (query) {
  return getSessionCookie()
  .then(cookie =>
    fetch(`${API_HOST}/noo/graphql`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Cookie': cookie
      },
      body: JSON.stringify({query})
    }))
  .then(resp => resp.json())
  .then(json => json.data)
}
