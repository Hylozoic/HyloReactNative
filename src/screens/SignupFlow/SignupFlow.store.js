export const MODULE_NAME = 'SignupFlow'
export const UPDATE_LOCAL_USER_SETTINGS = `${MODULE_NAME}/UPDATE_LOCAL_USER_SETTINGS`

export const defaultUserSettings = {
  name: '',
  email: null,
  password: '',
  confirmPassword: '',
  location: '',
  locationId: null,
  avatarUrl: '',
  settings: {}
}

export function getErrors (payload) {
  if (payload.response.body.startsWith('That email address is already in use')) {
    return {
      email: 'That address is already in use. Try logging in instead.'
    }
  }
}

export const initialState = {
  userSettings: defaultUserSettings,
  errors: {}
}

export default function reducer (state = initialState, action) {
  const { type, payload } = action

  switch (type) {
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

export function updateLocalUserSettings (settings) {
  return {
    type: UPDATE_LOCAL_USER_SETTINGS,
    payload: settings
  }
}

export function getLocalUserSettings (state) {
  return state[MODULE_NAME].userSettings
}
