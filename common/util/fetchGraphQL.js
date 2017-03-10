import { API_HOST } from 'react-native-dotenv'

export default function fetchGraphQL (query) {
  return fetch(`${API_HOST}/noo/graphql`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({query})
  })
  .then(resp => resp.json())
  .then(json => json.data)
}
