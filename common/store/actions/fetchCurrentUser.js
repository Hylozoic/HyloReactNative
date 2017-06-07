export const FETCH_CURRENT_USER = 'FETCH_CURRENT_USER'

export default function fetchCurrentUser () {
  return {
    type: FETCH_CURRENT_USER,
    graphql: {
      query: `{ me
        { id name avatarUrl }
      }`
    }
  }
}
