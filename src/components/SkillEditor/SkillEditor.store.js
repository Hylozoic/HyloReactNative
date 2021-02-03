import { createSelector as ormCreateSelector } from 'redux-orm'
import orm from 'store/models'

export const MODULE_NAME = 'SkillEditor'
export const SET_SKILL = `${MODULE_NAME}/SET_SKILL`
export const ADD_SKILL = `${MODULE_NAME}/ADD_SKILL`
export const ADD_SKILL_PENDING = `${ADD_SKILL}_PENDING`
export const REMOVE_SKILL = `${MODULE_NAME}/REMOVE_SKILL`
export const REMOVE_SKILL_PENDING = `${REMOVE_SKILL}_PENDING`
export const SET_USER_SKILLS = `${MODULE_NAME}/SET_USER_SKILLS`

export const defaultState = {
  skill: '',
  userSkills: []
}

export default function reducer (state = defaultState, action) {
  const { error, type, payload, meta } = action
  if (error) {
    return state
  }

  switch (type) {
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

export const getMySkillsFromOrm = ormCreateSelector(
  orm,
  (session) => {
    const me = session?.Me.first()
    return me ? me.skills.toModelArray() : []
  })

export function getSkill (state) {
  return state[MODULE_NAME].skill
}

export function getUserSkills (state) {
  return state[MODULE_NAME].userSkills
}
