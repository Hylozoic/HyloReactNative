/**
 * @providesModule store/reducers/queryResults
 */

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
import {
  CREATE_POST
} from '../../components/PostEditor/PostEditor.store'
import {
  FETCH_POST
} from '../actions/fetchPost'
import {
  FETCH_COMMENTS
} from '../../components/Comments/Comments.store'
import { get, isNull, omitBy, pick, reduce, uniq } from 'lodash/fp'

// reducer

export default function (state = {}, action) {
  const { type, payload, error, meta } = action
  if (error) return state
  let root

  const { extractQueryResults } = meta || {}
  // parameters below into the action's metadata, write a piece of middleware to
  if (extractQueryResults && payload) {
  // detect the metadata and produce a generic action, and have this reducer
    const { getItems, getParams, getType } = extractQueryResults
  // handle only that action.
    return appendIds(state,
      getType ? getType(action) : action.type,
      getParams ? getParams(action) : meta.graphql.variables,
      getItems(action)
    )
  }

  switch (type) {
    case CREATE_POST:
      root = payload.data.createPost
      return matchNewPostIntoQueryResults(state, root)

    case FETCH_POSTS:
      root = payload.data.posts || payload.data.community.posts
      return appendIds(state, type, meta.graphql.variables, root)
    case FETCH_POST:
    case FETCH_COMMENTS:
      if (!payload.data.post) break
      return appendIds(state, FETCH_COMMENTS, meta.graphql.variables, payload.data.post.comments)
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
      {slug: community.slug},
      {slug: community.slug, filter: type},
      {slug: community.slug, sortBy: 'updated'},
      {slug: community.slug, sortBy: 'updated', filter: type}
    ]
    return reduce((innerMemo, params) => {
      return prependIdForCreate(innerMemo, FETCH_POSTS, params, id)
    }, memo, queriesToMatch)
  }, state, communities)
}

function prependIdForCreate (state, type, params, id) {
  const key = buildKey(type, params)
  if (!state[key]) return state

  return {
    ...state,
    [key]: {
      ids: [id].concat(state[key].ids),
      total: state[key].total + 1,
      hasMore: state[key].hasMore
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
