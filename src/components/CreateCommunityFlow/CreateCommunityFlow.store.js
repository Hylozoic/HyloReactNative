export const MODULE_NAME = 'CreateCommunityName'
export const SAVE_COMMUNITY_NAME = `${MODULE_NAME}/SAVE_COMMUNITY_NAME`

export default function reducer (state = {}, action) {
  const { type, payload } = action
  switch (type) {
    case SAVE_COMMUNITY_NAME:
      return {
        ...state,
        communityName: payload
      }
  }
  return state
}

export function saveCommunityName (name) {
  return {
    type: SAVE_COMMUNITY_NAME,
    payload: name
  }
}
