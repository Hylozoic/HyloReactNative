export const defaultState = {
  userSettings: {},
  skill: '',
  userSkills: []
}

export const MODULE_NAME = 'SignupFlow'
export const UPDATE_USER_SETTINGS = `${MODULE_NAME}/UPDATE_USER_SETTINGS`
export const UPDATE_LOCAL_USER_SETTINGS = `${MODULE_NAME}/UPDATE_LOCAL_USER_SETTINGS`
export const SIGNUP = `${MODULE_NAME}/SIGNUP`
export const SET_SKILL = `${MODULE_NAME}/SET_SKILL`
export const ADD_USER_SKILL = `${MODULE_NAME}/ADD_USER_SKILL`
export const REMOVE_USER_SKILL = `${MODULE_NAME}/REMOVE_USER_SKILL`
export const SET_USER_SKILLS = `${MODULE_NAME}/SET_USER_SKILLS`

export default function reducer (state = defaultState, action) {
  const { error, type, payload } = action
  if (error) return state

  switch (type) {
    case UPDATE_LOCAL_USER_SETTINGS:
      return {
        ...state,
        userSettings: {
          ...state.userSettings,
          ...payload
        }
      }
    case SET_SKILL:
      return {
        ...state,
        skill: payload
      }
    case ADD_USER_SKILL:
      return {
        ...state,
        userSkills: state.userSkills.concat([payload])
      }
    case REMOVE_USER_SKILL:
      return {
        ...state,
        userSkills: state.userSkills.filter(s => s !== payload)
      }
    case SET_USER_SKILLS:
      return {
        ...state,
        userSkills: payload
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

export function updateLocalUserSettings (settings) {
  return {
    type: UPDATE_LOCAL_USER_SETTINGS,
    payload: settings
  }
}

export function updateUserSettings (changes) {
  return {
    type: UPDATE_USER_SETTINGS,
    graphql: {
      query: `mutation ($changes: MeInput) {
        updateMe(changes: $changes) {
          id
        }
      }`,
      variables: {
        changes
      }
    },
    meta: {
      optimistic: true,
      changes
    }
  }
}

export function setSkill (skill) {
  return {
    type: SET_SKILL,
    payload: skill
  }
}

export function addUserSkill (skill) {
  return {
    type: ADD_USER_SKILL,
    payload: skill
  }
}

export function removeUserSkill (skill) {
  return {
    type: REMOVE_USER_SKILL,
    payload: skill
  }
}

export function setUserSkills (userSkills) {
  return {
    type: SET_USER_SKILLS,
    payload: userSkills
  }
}

export function getUserSettings (state) {
  return state[MODULE_NAME].userSettings
}

export function getSkill (state) {
  return state[MODULE_NAME].skill
}

export function getUserSkills (state) {
  return state[MODULE_NAME].userSkills
}
