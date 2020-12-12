import { createSelector } from 'reselect'
import { postsQueryFragment } from '../../../store/actions/fetchPosts'
import { get } from 'lodash/fp'
import {
  makeGetQueryResults, makeQueryResultsModelSelector
} from '../../../store/reducers/queryResults'

export const MODULE_NAME = 'MemberFeed'
export const SET_CHOICE = `${MODULE_NAME}/SET_CHOICE`
export const FETCH_MEMBER_POSTS = `${MODULE_NAME}/FETCH_MEMBER_POSTS`
export const FETCH_MEMBER_COMMENTS = `${MODULE_NAME}/FETCH_MEMBER_COMMENTS`
export const FETCH_MEMBER_UPVOTES = `${MODULE_NAME}/FETCH_MEMBER_UPVOTES`

export function fetchMemberPosts ({ id, first = 10, offset }) {
  return {
    type: FETCH_MEMBER_POSTS,
    graphql: {
      query: `query MemberPosts (
        $id: ID,
        $sortBy: String,
        $offset: Int,
        $search: String,
        $filter: String,
        $first: Int,
        $topic: ID
      ) {
        person (id: $id) {
          id
          ${postsQueryFragment}
        }
      }`,
      variables: { id, first, offset }
    },
    meta: {
      afterInteractions: true,
      extractModel: 'Person',
      extractQueryResults: {
        getItems: get('payload.data.person.posts')
      }
    }
  }
}

export function fetchMemberComments ({ id, first = 20, offset }) {
  return {
    type: FETCH_MEMBER_COMMENTS,
    graphql: {
      query: `query MemberComments ($id: ID, $first: Int, $offset: Int) {
        person (id: $id) {
          id
          comments (first: $first, offset: $offset, order: "desc") {
            hasMore
            items {
              id
              text
              creator {
                id
              }
              post {
                id
                title
              }
              createdAt
            }
          }
        }
      }`,
      variables: { id, first, offset }
    },
    meta: {
      afterInteractions: true,
      extractModel: 'Person',
      extractQueryResults: {
        getItems: get('payload.data.person.comments')
      }
    }
  }
}

export function fetchMemberUpvotes ({ id, first = 20, offset }) {
  return {
    type: FETCH_MEMBER_UPVOTES,
    graphql: {
      query: `query MemberVotes ($id: ID, $first: Int, $offset: Int) {
        person (id: $id) {
          id
          votes (first: $first, offset: $offset, order: "desc") {
            hasMore
            items {
              id
              post {
                id
                title
                details
                type
                creator {
                  id
                  name
                  avatarUrl
                }
                commenters {
                  id,
                  name,
                  avatarUrl
                }
                commentersTotal
                communities {
                  id
                  name
                }
                createdAt
              }
              voter {
                id
              }
              createdAt
            }
          }
        }
      }`,
      variables: { id, first, offset }
    },
    meta: {
      afterInteractions: true,
      extractModel: 'Person',
      extractQueryResults: {
        getItems: get('payload.data.person.votes')
      }
    }
  }
}

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

const getMemberPostResults = makeGetQueryResults(FETCH_MEMBER_POSTS)

export const getHasMoreMemberPosts = createSelector(getMemberPostResults, get('hasMore'))

export const getMemberPosts = makeQueryResultsModelSelector(
  getMemberPostResults,
  'Post',
  post => ({
    ...post.ref,
    creator: post.creator,
    commenters: post.commenters.toRefArray(),
    communities: post.communities.toRefArray(),
    topics: post.topics.toRefArray()
  })
)

const getMemberCommentResults = makeGetQueryResults(FETCH_MEMBER_COMMENTS)

export const getHasMoreMemberComments = createSelector(getMemberCommentResults, get('hasMore'))

export const getMemberComments = makeQueryResultsModelSelector(
  getMemberCommentResults,
  'Comment',
  comment => ({
    ...comment.ref,
    creator: comment.creator,
    post: comment.post
  })
)

const getMemberUpvotesResults = makeGetQueryResults(FETCH_MEMBER_UPVOTES)

export const getHasMoreMemberUpvotes = createSelector(getMemberUpvotesResults, get('hasMore'))

export const getMemberUpvotes = makeQueryResultsModelSelector(
  getMemberUpvotesResults,
  'Vote',
  vote => ({
    ...vote.post.ref,
    creator: vote.post.creator,
    commenters: vote.post.commenters.toModelArray(),
    communities: vote.post.communities.toModelArray()
  })
)
