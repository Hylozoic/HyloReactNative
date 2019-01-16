import { SET_QUERY_SEARCH_TERM } from '../constants'

export const defaultState = {}

export default function querySearchTermsReducer (state = {}, action) {
  const { type, payload } = action

  switch (type) {
    case SET_QUERY_SEARCH_TERM:
      const { scope, searchTerm } = payload
      return {
        ...state,
        [scope]: searchTerm
      }
  }
  return state
}
