import { get } from 'lodash/fp'

export const MODULE_NAME = 'SignupFlow'
export const UPDATE_LOCAL_USER_SETTINGS = `${MODULE_NAME}/UPDATE_LOCAL_USER_SETTINGS`
export const SIGNUP = `${MODULE_NAME}/SIGNUP`

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

export function updateLocalUserSettings (settings) {
  return {
    type: UPDATE_LOCAL_USER_SETTINGS,
    payload: settings
  }
}

// TODO: Previously was expecting to also send email address?
export function signup (name, password) {
  return {
    type: SIGNUP,
    graphql: {
      query: `mutation ($name: String, $password: String) {
        register(name: $name, password: $password) {
          id
          email
          emailValidated
          hasRegistered
          name
          settings {
            alreadySeenTour
            digestFrequency
            dmNotifications
            commentNotifications
            signupInProgress
            streamViewMode
            streamSortBy
            streamPostType
          }
        }
      }`,
      variables: {
        name,
        password
      }
    },
    meta: {
      extractModel: [
        {
          getRoot: get('register'),
          modelName: 'Me'
        }
      ]
    }
  }
}

export function getLocalUserSettings (state) {
  return state[MODULE_NAME].userSettings
}

export function getSignupErrors (state) {
  return state[MODULE_NAME].errors
}
