import client from 'urql-shared/client'
import MeQuery from 'graphql/queries/MeQuery'

export function getCurrentUserFromCache () {
  try {
    const result = client.readQuery(MeQuery)
    return result?.data?.me || null
  } catch (error) {
    console.log('!!! URQL error when trying to retrieve currentUser from cache:', error)
    return null
  }
}

export default function useCurrentUser () {
  return getCurrentUserFromCache()
}
