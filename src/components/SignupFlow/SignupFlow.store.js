import { createSelector as ormCreateSelector } from 'redux-orm'
import orm from 'store/models'

export const MODULE_NAME = 'SignupFlow'
export const UPDATE_USER_SETTINGS = `${MODULE_NAME}/UPDATE_USER_SETTINGS`
export const UPDATE_LOCAL_USER_SETTINGS = `${MODULE_NAME}/UPDATE_LOCAL_USER_SETTINGS`
export const SIGNUP = `${MODULE_NAME}/SIGNUP`
export const SET_SKILL = `${MODULE_NAME}/SET_SKILL`
export const ADD_SKILL = `${MODULE_NAME}/ADD_SKILL`
export const ADD_SKILL_PENDING = `${ADD_SKILL}_PENDING`
export const REMOVE_SKILL = `${MODULE_NAME}/REMOVE_SKILL`
export const REMOVE_SKILL_PENDING = `${REMOVE_SKILL}_PENDING`
export const SET_USER_SKILLS = `${MODULE_NAME}/SET_USER_SKILLS`

export const defaultState = {
  userSettings: {
    name: '',
    email: '',
    password: '',
    location: '',
    avatarUrl: ''
  },
  skill: '',
  userSkills: []
}

export default function reducer (state = defaultState, action) {
  const { error, type, payload, meta } = action
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
    case ADD_SKILL_PENDING:
      return {
        ...state,
        skill: '',
        userSkills: state.userSkills.concat([meta.name])
      }
    case REMOVE_SKILL_PENDING:
      return {
        ...state,
        userSkills: state.userSkills.filter(s => s !== meta.name)
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

export function addSkill (name) {
  return {
    type: ADD_SKILL,
    graphql: {
      query: `mutation ($name: String) {
        addSkill(name: $name) {
          id,
          name
        }
      }`,
      variables: {
        name
      }
    },
    meta: {
      optimistic: true,
      name
    }
  }
}

export function removeSkill (name) {
  return {
    type: REMOVE_SKILL,
    graphql: {
      query: `mutation ($name: String) {
        removeSkill(name: $name) {
          success
        }
      }`,
      variables: {
        name
      }
    },
    meta: {
      optimistic: true,
      name
    }
  }
}

export function setUserSkills (userSkills) {
  return {
    type: SET_USER_SKILLS,
    payload: userSkills
  }
}

export const getSkillsFromOrm = ormCreateSelector(
  orm,
  state => state.orm,
  ({ Me }) => {
    const me = Me.first()
    me && console.log('me.skills', me.skills)
    return me ? me.skills.toModelArray() : []
  })

export function getUserSettings (state) {
  return state[MODULE_NAME].userSettings
}

export function getSkill (state) {
  return state[MODULE_NAME].skill
}

export function getUserSkills (state) {
  return state[MODULE_NAME].userSkills
}
