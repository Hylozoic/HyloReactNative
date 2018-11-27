import { trim } from 'lodash/fp'

export const MODULE_NAME = 'ItemChooser'
export const SET_SEARCH_TEXT = `${MODULE_NAME}/SET_SEARCH_TEXT`

export function setSearchText (searchText) {
  return {
    type: SET_SEARCH_TEXT,
    payload: {
      searchText: searchText && trim(searchText) !== '' ? trim(searchText) : undefined
    }
  }
}

export const defaultState = {
  searchText: undefined
}

export default function reducer (state = defaultState, action) {
  const { type, payload } = action

  switch (type) {
    case SET_SEARCH_TEXT:
      return {
        ...state,
        searchText: payload.searchText
      }
  }

  return state
}

export function getSearchText (state) {
  return state[MODULE_NAME].searchText
}
