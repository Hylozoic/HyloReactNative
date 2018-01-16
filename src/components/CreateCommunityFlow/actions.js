export const MODULE_NAME = `CreateCommunityFlow`
// export const ADD_COMMUNITY_NAME = `${MODULE_NAME}/ADD_COMMUNITY_NAME`
// export const ADD_COMMUNITY_DOMAIN = `${MODULE_NAME}/ADD_COMMUNITY_DOMAIN`
// export const ADD_COMMUNITY_PRIVACY = `${MODULE_NAME}/ADD_COMMUNITY_PRIVACY`

export const FETCH_COMMUNITY_EXISTS = `${MODULE_NAME}/FETCH_URL_EXISTS`

export function fetchCommunityExists (slug) {
  return {
    type: FETCH_COMMUNITY_EXISTS,
    graphql: {
      query: `
        query ($slug: String) {
          communityExists (slug: $slug) {
            exists
          }
        }
      `,
      variables: {
        slug
      }
    }
  }
}
