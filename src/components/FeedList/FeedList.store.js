import { makeGetQueryResults, makeQueryResultsModelSelector } from '../../store/reducers/queryResults'
import { FETCH_POSTS } from '../../store/actions/fetchPosts'
import { createSelector } from 'reselect'
import { createSelector as ormCreateSelector } from 'redux-orm'
import { get, includes, isEmpty } from 'lodash/fp'
import orm from '../../store/models'

export const MODULE_NAME = 'FeedList'

export const SET_FILTER = `${MODULE_NAME}/SET_FILTER`
export const SET_SORT = `${MODULE_NAME}/SET_SORT`

export const defaultState = {
  filter: null,
  sortBy: 'updated'
}

export default function reducer (state = defaultState, action) {
  const { error, type, payload } = action
  if (error) return state

  switch (type) {
    case SET_FILTER:
      return {
        ...state,
        filter: payload
      }
    case SET_SORT:
      return {
        ...state,
        sortBy: payload
      }
    default:
      return state
  }
}

export function setFilter (filter) {
  return {
    type: SET_FILTER,
    payload: filter
  }
}

export function setSort (sortBy) {
  return {
    type: SET_SORT,
    payload: sortBy
  }
}

export function getFilter (state) {
  return state[MODULE_NAME].filter
}

export function getSort (state) {
  return state[MODULE_NAME].sortBy
}

const getPostResults = makeGetQueryResults(FETCH_POSTS)

// export const getPosts = ormCreateSelector(
//   orm,
//   state => state.orm,
//   getPostResults,
//   (session, results) => {
//     if (isEmpty(results) || isEmpty(results.ids)) return []
//     return session.Post.all()
//     .filter(x => includes(x.id, results.ids))
//     .orderBy(x => results.ids.indexOf(x.id))
//     .toModelArray()
//     .map(post => ({
//       ...post.ref,
//       creator: post.creator,
//       commenters: post.commenters.toModelArray(),
//       communities: post.communities.toModelArray()
//     }))
//   }
// )

export const getPosts = makeQueryResultsModelSelector(
  getPostResults,
  'Post',
  post => ({
    ...post.ref,
    creator: post.creator,
    commenters: post.commenters.toModelArray(),
    communities: post.communities.toModelArray()
  })
)

export const getHasMorePosts = createSelector(getPostResults, get('hasMore'))
