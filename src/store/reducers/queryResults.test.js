import queryResults, { buildKey } from './queryResults'
import { FETCH_POSTS } from '../actions/fetchPosts'
import { get } from 'lodash/fp'

const variables = {slug: 'foo', sortBy: 'name'}

const key = JSON.stringify({
  type: FETCH_POSTS,
  params: variables
})

it('adds data to empty state', () => {
  const state = {}
  const action = {
    type: FETCH_POSTS,
    payload: {
      data: {
        community: {
          posts: {
            total: 22,
            items: [{id: 7}, {id: 8}, {id: 9}],
            hasMore: true
          }
        }
      }
    },
    meta: {
      graphql: {variables},
      extractQueryResults: {
        getItems: get('payload.data.community.posts')
      }
    }
  }

  expect(queryResults(state, action)).toEqual({
    [key]: {
      ids: [7, 8, 9],
      total: 22,
      hasMore: true
    }
  })
})

it('appends to existing data, ignoring duplicates', () => {
  const state = {
    [key]: {
      ids: [4, 7, 5, 6],
      total: 21,
      hasMore: true
    }
  }

  const action = {
    type: FETCH_POSTS,
    payload: {
      data: {
        community: {
          posts: {
            total: 22,
            items: [{id: 7}, {id: 8}, {id: 9}],
            hasMore: false
          }
        }
      }
    },
    meta: {
      graphql: {variables},
      extractQueryResults: {
        getItems: get('payload.data.community.posts')
      }
    }
  }

  expect(queryResults(state, action)).toEqual({
    [key]: {
      ids: [4, 7, 5, 6, 8, 9],
      total: 22,
      hasMore: false
    }
  })
})

it('uses getType and getParams from extractQueryResults', () => {
  const state = {}
  const action = {
    type: 'DIFFERENT_TYPE',
    payload: {
      data: {
        community: {
          posts: {
            total: 22,
            items: [{id: 7}, {id: 8}, {id: 9}],
            hasMore: true
          }
        }
      }
    },
    meta: {
      graphql: {
        slug: 'wrongslug',
        sortBy: 'irrelevance'
      },
      extractQueryResults: {
        getType: () => FETCH_POSTS,
        getParams: () => variables,
        getItems: get('payload.data.community.posts')
      }
    }
  }

  expect(queryResults(state, action)).toEqual({
    [key]: {
      ids: [7, 8, 9],
      total: 22,
      hasMore: true
    }
  })
})

describe('buildKey', () => {
  it('omits blank parameters', () => {
    expect(buildKey('actionType', {slug: 'foo', search: null}))
    .toEqual('{"type":"actionType","params":{"slug":"foo"}}')
  })
})
