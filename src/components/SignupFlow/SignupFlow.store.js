export const defaultState = {
  userSettings: {}
}

export const MODULE_NAME = 'SignupFlow'
export const UPDATE_USER_SETTINGS = `${MODULE_NAME}/UPDATE_USER_SETTINGS`
export const SAVE_USER_SETTINGS = `${MODULE_NAME}/SAVE_USER_SETTINGS`
export const SIGNUP = `${MODULE_NAME}/SIGNUP`

export default function reducer (state = defaultState, action) {
  const { error, type, payload } = action
  if (error) return state

  switch (type) {
    case UPDATE_USER_SETTINGS:
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

export function signup ({ name, email, password }) {
  let params = {name, email, password, resp: 'user', login: true}
  return {
    type: SIGNUP,
    payload: {
      api: {method: 'post', path: '/noo/user', params}
    }
  }
}

export function updateUserSettings (settings) {
  return {
    type: UPDATE_USER_SETTINGS,
    payload: settings
  }
}

export function saveUserSettings (settings) {
  return {
    type: SAVE_USER_SETTINGS,
    payload: settings
  }
}

export function getUserSettings (state) {
  return state[MODULE_NAME].userSettings
}
