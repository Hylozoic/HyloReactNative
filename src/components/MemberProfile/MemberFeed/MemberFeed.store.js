import { createSelector as ormCreateSelector } from 'redux-orm'
import orm from 'store/models'

export const MODULE_NAME = 'MemberFeed'
export const SET_CHOICE = `${MODULE_NAME}/SET_CHOICE`

export const defaultState = {
  choice: 'Posts'
}

export default function reducer (state = defaultState, action) {
  const { error, type, payload } = action
  if (error) return state

  switch (type) {
    case SET_CHOICE:
      return {
        ...state,
        choice: payload
      }
    default:
      return state
  }
}

export function setChoice (choice) {
  return {
    type: SET_CHOICE,
    payload: choice
  }
}

export function getChoice (state) {
  return state[MODULE_NAME].choice
}
