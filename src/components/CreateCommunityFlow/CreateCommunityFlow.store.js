export const MODULE_NAME = `CreateCommunityFlow`
export const SAVE_COMMUNITY_NAME = `${MODULE_NAME}/SAVE_COMMUNITY_NAME`
export const FETCH_URL_EXISTS = `${MODULE_NAME}/FETCH_URL_EXISTS`

export default function reducer (state = {}, action) {
  const { type, payload } = action
  console.log('state, action', state, action)
  switch (type) {
    case SAVE_COMMUNITY_NAME:
      return {
        ...state,
        communityName: payload
      }
    case FETCH_URL_EXISTS:
      return {
        ...state,
        urlExists: action.payload.data.communityExists.exists
      }
  }
  console.log('CreateCommunityFlow reducer state', state)
  return state
}

export function saveCommunityName (name) {
  return {
    type: SAVE_COMMUNITY_NAME,
    payload: name
  }
}
