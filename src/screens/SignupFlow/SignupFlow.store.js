export
{ default as updateUserSettings, UPDATE_USER_SETTINGS, UPDATE_USER_SETTINGS_PENDING }
  from 'store/actions/updateUserSettings'

export const MODULE_NAME = 'SignupFlow'
export const UPDATE_LOCAL_USER_SETTINGS = `${MODULE_NAME}/UPDATE_LOCAL_USER_SETTINGS`
export const SIGNUP = `${MODULE_NAME}/SIGNUP`

export const defaultUserSettings = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  location: '',
  locationId: null,
  avatarUrl: '',
  settings: {}
}

export const defaultState = {
  userSettings: defaultUserSettings,
  errors: {}
}

export function getErrors (payload) {
  if (payload.response.body.startsWith('That email address is already in use')) {
    return {
      email: 'That address is already in use. Try logging in instead.'
    }
  }
}

export default function reducer (state = defaultState, action) {
  const { error, type, payload } = action
  if (error) {
    switch (type) {
      case SIGNUP:
        return {
          ...state,
          errors: getErrors(payload)
        }
      default:
        return state
    }
  }

  switch (type) {
    case SIGNUP:
      return {
        ...state,
        errors: {}
      }
    case UPDATE_LOCAL_USER_SETTINGS:
      return {
        ...state,
        userSettings: {
          ...state.userSettings,
          ...payload
        }
      }
    default:
      return state
  }
}

export function signup ({ name, password }) {
  const params = { name, password, resp: 'user', login: true }
  return {
    type: SIGNUP,
    payload: {
      api: { method: 'post', path: '/noo/user', params }
    }
  }
}

export function updateLocalUserSettings (settings) {
  return {
    type: UPDATE_LOCAL_USER_SETTINGS,
    payload: settings
  }
}

export function getUserSettings (state) {
  return state[MODULE_NAME].userSettings
}

export function getSignupErrors (state) {
  return state[MODULE_NAME].errors
}
