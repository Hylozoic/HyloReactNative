import { get, replace } from 'lodash/fp'
import { createSelector } from 'reselect'
import { fetchMapboxLocations } from 'services/mapbox'
import convertMapboxToLocation from 'util/convertMapboxToLocation'

export const MODULE_NAME = 'ItemChooser'
export const SET_SEARCH_TERM = `${MODULE_NAME}/SET_SEARCH_TERM`
export const SET_SEARCH_SUGGESTIONS = `${MODULE_NAME}/SET_SEARCH_SUGGESTIONS`

export const getModule = state => state[MODULE_NAME]

export const getScope = (_, props) => props.scope ? props.scope : 'defaultItemChooser'

export const getSearchTerm = createSelector(
  getModule,
  getScope,
  (module, scope) => get([scope, 'searchTerm'], module)
)

export const getSearchSuggestions = createSelector(
  getModule,
  getScope,
  (module, scope) => get([scope, 'searchSuggestions'], module)
)

export function setSearchTerm (scope, searchTerm = '', opts = {}) {
  if (!scope) throw new Error('`scope` param is required')

  const defaultSearchTermFilter = replace(/\s/g, '')
  const searchTermFilter = opts.searchTermFilter || defaultSearchTermFilter
  let filteredSearchTerm = searchTermFilter(searchTerm)

  filteredSearchTerm = filteredSearchTerm !== ''
    ? filteredSearchTerm
    : undefined

  return {
    type: SET_SEARCH_TERM,
    payload: {
      scope,
      searchTerm: filteredSearchTerm
    }
  }
}

// Not currently used anywhere
export function setSearchSuggestions (scope, searchSuggestions = []) {
  if (!scope) throw new Error('`scope` param is required')

  return {
    type: SET_SEARCH_SUGGESTIONS,
    payload: {
      scope,
      searchSuggestions
    }
  }
}

export async function locationSearch (scope, searchTerm, proximity) {
  const mapboxLocations = await fetchMapboxLocations(searchTerm, { proximity })
  let locations = mapboxLocations
    .features
    .map(feature => ({
      ...convertMapboxToLocation(feature),
      id: feature.id
    }))
  locations = [
    { id: 'NEW', fullText: searchTerm },
    ...locations
  ]

  return {
    type: SET_SEARCH_SUGGESTIONS,
    payload: {
      scope,
      searchSuggestions: locations
    }
  }
}

export const defaultState = {}

export default function reducer (state = defaultState, action) {
  const { error, type, payload } = action
  if (error) return state

  switch (type) {
    case SET_SEARCH_TERM:
      return {
        ...state,
        [payload.scope]: {
          searchTerm: payload.searchTerm,
          searchSuggestions: []
        }
      }
    case SET_SEARCH_SUGGESTIONS:
      return {
        ...state,
        [payload.scope]: {
          ...state[payload.scope],
          searchSuggestions: payload.searchSuggestions
        }
      }
    default:
      return state
  }
}
