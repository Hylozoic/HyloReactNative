import { omit } from 'lodash/fp'

export const MODULE_NAME = 'SignupFlow'
export const CLEAR_EMAIL_TO_VERIFY = `${MODULE_NAME}/CLEAR_EMAIL_TO_VERIFY`
export const SEND_EMAIL_VERIFICATION = `${MODULE_NAME}/SEND_EMAIL_VERIFICATION`
export const SET_EMAIL_TO_VERIFY = `${MODULE_NAME}/SET_EMAIL_TO_VERIFY`
export const UPDATE_LOCAL_USER_SETTINGS = `${MODULE_NAME}/UPDATE_LOCAL_USER_SETTINGS`
export const SIGNUP = `${MODULE_NAME}/SIGNUP`

export const defaultUserSettings = {
  emailToVerify: null,
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
  const { error, type, payload, meta } = action
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
    case CLEAR_EMAIL_TO_VERIFY:
      return omit('emailToVerify', state)
    case SEND_EMAIL_VERIFICATION: 
      return {
        ...state,
        emailToVerify: meta.emailToVerify
      }
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

export function clearEmailToVerify () {
  return {
    type: CLEAR_EMAIL_TO_VERIFY
  }
}

export function sendEmailVerification (email) {
  return {
    type: SEND_EMAIL_VERIFICATION,
    payload: {
      api: {
        method: 'post',
        path: '/noo/user/send-email-verification',
        params: {
          email
        }
      }
    },
    meta: {
      emailToVerify: email
    }
  }
}

export function updateLocalUserSettings (settings) {
  return {
    type: UPDATE_LOCAL_USER_SETTINGS,
    payload: settings
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

export function getUserSettings (state) {
  return state[MODULE_NAME].userSettings
}

export function getSignupErrors (state) {
  return state[MODULE_NAME].errors
}

export function getEmailToVerify (state) {
  return state[MODULE_NAME].emailToVerify
}
