// The purpose of this reducer is to provide a general-purpose store for keeping
// track of the ordering of lists of data fetched from the API.
//
// For example, the Members component will want to track the order of Members
// to show when the sort order is set to "Name" separately from when it is set
// to "Location". And both of these lists are different from what should be
// shown when something has been typed into the search field.

import {
  FETCH_POSTS
} from 'store/actions/fetchPosts'
import {
  CREATE_POST, CREATE_PROJECT
} from 'navigation/PostEditor/PostEditor.store'
import {
  RECEIVE_POST
} from 'components/SocketListener/SocketListener.store'
import {
  REMOVE_POST_PENDING
} from 'components/PostCard/PostHeader/PostHeader.store'

import { get, isNull, omitBy, pick, reduce, uniq, isEmpty, includes } from 'lodash/fp'
import { createSelector as ormCreateSelector } from 'redux-orm'
import orm from 'store/models'
import { mapValues } from 'lodash'
// reducer

export default function (state = {}, action) {
  const { type, payload, error, meta } = action
  if (error) return state
  let root

  const { extractQueryResults } = meta || {}
  if (extractQueryResults && payload) {
    const { getItems, getParams, getType, reset } = extractQueryResults
    return addIds(state, {
      type: getType ? getType(action) : action.type,
      params: getParams ? getParams(action) : meta.graphql.variables,
      data: getItems(action),
      reset
    })
  }

  switch (type) {
    case CREATE_POST:
      root = payload.data.createPost
      return matchNewPostIntoQueryResults(state, root)

    case CREATE_PROJECT:
      root = payload.data.createProject
      return matchNewPostIntoQueryResults(state, root)

    case RECEIVE_POST:
      return matchNewPostIntoQueryResults(state, payload.data.post)

    case REMOVE_POST_PENDING:
      return mapValues(state, (results, key) => {
        if (get('params.slug', JSON.parse(key)) !== meta.slug) return results
        return {
          ...results,
          ids: results.ids.filter(id => id !== meta.postId)
        }
      })
  }
  return state
}

function matchNewPostIntoQueryResults (state, { id, type, communities }) {
  /* about this:
      we add the post id into queryResult sets that are based on time of
      creation because we know that the post just created is the latest
      so we can prepend it. we have to match the different variations which
      can be implicit or explicit about sorting by 'updated'.
  */
  return reduce((memo, community) => {
    const queriesToMatch = [
      { slug: community.slug },
      { slug: community.slug, filter: type },
      { slug: community.slug, sortBy: 'updated' },
      { slug: community.slug, sortBy: 'updated', filter: type }
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
      ids: uniq([id].concat(state[key].ids)),
      total: state[key].total + 1,
      hasMore: state[key].hasMore
    }
  }
}

export function addIds (state, { type, params, data, reset }) {
  if (!data) return state
  const { items, total, hasMore } = data
  const key = buildKey(type, params)
  const existingIds = (!reset && get('ids', state[key])) || []
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
  'networkSlug',
  'sortBy',
  'search',
  'autocomplete',
  'filter',
  'topic',
  'type',
  'memberSubject'
]

export function makeQueryResultsModelSelector (resultsSelector, modelName, transform = i => i) {
  return ormCreateSelector(
    orm,
    state => state.orm,
    resultsSelector,
    (session, results) => {
      if (isEmpty(results) || isEmpty(results.ids)) return []
      return session[modelName].all()
        .filter(x => includes(x.id, results.ids))
        .orderBy(x => results.ids.indexOf(x.id))
        .toModelArray()
        .map(transform)
    })
}
