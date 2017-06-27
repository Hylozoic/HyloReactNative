// The purpose of this reducer is to provide a general-purpose store for keeping
// track of the ordering of lists of data fetched from the API.
//
// For example, the Members component will want to track the order of Members
// to show when the sort order is set to "Name" separately from when it is set
// to "Location". And both of these lists are different from what should be
// shown when something has been typed into the search field.

import {
  FETCH_POSTS
} from '../actions/fetchPosts'
import { get, isNull, omitBy, pick, reduce, uniq } from 'lodash/fp'

// reducer

export default function (state = {}, action) {
  const { type, payload, error, meta } = action
  if (error) return state
  let root

  // If this starts to feel too coupled to specific actions, we could move the
  // parameters below into the action's metadata, write a piece of middleware to
  // detect the metadata and produce a generic action, and have this reducer
  // handle only that action.
  switch (type) {
    case FETCH_POSTS:
      root = payload.data.posts || payload.data.community.posts
      return appendIds(state, type, meta.graphql.variables, root)
  }
  return state
}

function matchNewPostIntoQueryResults (state, {id, type, communities}) {
  /* about this:
      we add the post id into queryResult sets that are based on time of
      creation because we know that the post just created is the latest
      so we can prepend it. we have to match the different variations which
      can be implicit or explicit about sorting by 'updated'.
  */
  return reduce((memo, community) => {
    const queriesToMatch = [
      {id: community.slug},
      {id: community.slug, filter: type},
      {id: community.slug, sortBy: 'updated'},
      {id: community.slug, sortBy: 'updated', filter: type}
    ]
    return reduce((innerMemo, params) => {
      return prependIdForCreate(innerMemo, FETCH_POSTS, params, id)
    }, memo, queriesToMatch)
  }, state, communities)
}

function prependIdForCreate (state, type, params, id) {
  const key = buildKey(type, params)
  const existingIds = get('ids', state[key]) || []
  return {
    ...state,
    [key]: {
      ids: [id].concat(existingIds),
      total: state[key] && state[key].total + 1,
      hasMore: state[key] && state[key].hasMore
    }
  }
}

function appendIds (state, type, params, { items, total, hasMore }) {
  const key = buildKey(type, params)
  const existingIds = get('ids', state[key]) || []
  return {
    ...state,
    [key]: {
      ids: uniq(existingIds.concat(items.map(x => x.id))),
      total,
      hasMore
    }
  }
}

// selector factory

export function makeGetQueryResults (actionType) {
  return (state, props) => {
    // TBD: Sometimes parameters like "id" and "slug" are to be found in the
    // URL, in which case they are in e.g. props.match.params.id; and sometimes
    // they are passed directly to a component. Should buildKey handle both
    // cases?
    const key = buildKey(actionType, props)

    return state.queryResults[key]
  }
}

export function buildKey (type, params) {
  return JSON.stringify({
    type,
    params: omitBy(isNull, pick(queryParamWhitelist, params))
  })
}

export const queryParamWhitelist = [
  'id',
  'slug',
  'sortBy',
  'search',
  'autocomplete',
  'filter',
  'topic',
  'type'
]
