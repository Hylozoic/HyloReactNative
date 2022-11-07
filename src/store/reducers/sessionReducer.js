import { LOGIN_WITH_APPLE, LOGIN_WITH_FACEBOOK, LOGIN_WITH_GOOGLE } from 'components/SocialAuth/actions'
import { LOGIN, LOGIN_BY_TOKEN, SET_CURRENT_GROUP_ID } from 'store/constants'

export const initialState = {
  defaultLoginEmail: null,
  groupId: null
}

export default function sessionReducer (state = initialState, action) {
  const { type, payload, meta } = action

  switch (type) {
    case LOGIN:
    case LOGIN_BY_TOKEN:
    case LOGIN_WITH_APPLE:
    case LOGIN_WITH_FACEBOOK:
    case LOGIN_WITH_GOOGLE: {
      return {
        defaultLoginEmail: meta?.email
      }
    }

    case SET_CURRENT_GROUP_ID: {
      return {
        ...state,
        groupId: payload
      }
    }
  }

  return state
}
