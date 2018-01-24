export const MODULE_NAME = `CreateCommunityFlow`
export const SAVE_COMMUNITY_NAME = `${MODULE_NAME}/SAVE_COMMUNITY_NAME`
export const SAVE_COMMUNITY_URL = `${MODULE_NAME}/SAVE_COMMUNITY_URL`
export const FETCH_URL_EXISTS = `${MODULE_NAME}/FETCH_URL_EXISTS`
export const CREATE_COMMUNITY = `${MODULE_NAME}/CREATE_COMMUNITY`
export const CLEAR_NAME_AND_URL_FROM_STORE = `${MODULE_NAME}/CLEAR_NAME_AND_URL_FROM_STORE`
export const FETCH_COMMUNITY_EXISTS = `${MODULE_NAME}/FETCH_URL_EXISTS`

export default function reducer (state = {}, action) {
  const { type, payload } = action
  switch (type) {
    case SAVE_COMMUNITY_NAME:
      return {
        ...state,
        communityName: payload
      }
    case SAVE_COMMUNITY_URL:
      return {
        ...state,
        communityUrl: payload
      }
    case CLEAR_NAME_AND_URL_FROM_STORE:
      return {
        ...state,
        communityUrl: null,
        communityName: null
      }
    case FETCH_URL_EXISTS:
      return {
        ...state,
        urlExists: action.payload.data.communityExists.exists
      }
  }
  return state
}

export function createCommunity (name, slug) {
  return {
    type: CREATE_COMMUNITY,
    graphql: {
      query: `mutation ($data: CommunityInput) {
        createCommunity(data: $data) {
          id
          hasModeratorRole
          community {
            id
            name
            slug
          }
        }
      }
      `,
      variables: {
        data: {
          name,
          slug
        }
      }
    },
    meta: {
      extractModel: 'Membership',
      slug,
      name
    }
  }
}

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

export function saveCommunityName (name) {
  return {
    type: SAVE_COMMUNITY_NAME,
    payload: name
  }
}

export function saveCommunityUrl (url) {
  return {
    type: SAVE_COMMUNITY_URL,
    payload: url
  }
}

export function clearNameAndUrlFromStore () {
  return {
    type: CLEAR_NAME_AND_URL_FROM_STORE
  }
}

export function getCommunityName (state) {
  return state[MODULE_NAME].communityName
}

export function getCommunityUrl (state) {
  return state[MODULE_NAME].communityUrl
}

export function getCommunityUrlExists (state) {
  return state[MODULE_NAME].urlExists
}
