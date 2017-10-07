import queryResults, { buildKey, makeQueryResultsModelSelector, makeGetQueryResults } from './queryResults'
import { FETCH_POSTS } from '../actions/fetchPosts'
import { get } from 'lodash/fp'
import orm from 'store/models'

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
it('replaces existing data when the "reset" option is set', () => {
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
        getItems: get('payload.data.community.posts'),
        reset: true
      }
    }
  }

  expect(queryResults(state, action)).toEqual({
    [key]: {
      ids: [7, 8, 9],
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

describe('makeQueryResultsModelSelector', () => {
  const session = orm.session(orm.getEmptyState())

  const specs = [
    {
      modelName: 'Person',
      values: {
        id: 1,
        name: 'The Creator'
      }
    },
    {
      modelName: 'Post',
      values: {
        id: 2,
        title: 'First past the',
        creator: 1
      }
    },
    {
      modelName: 'Post',
      values: {
        id: 3,
        title: 'third post',
        creator: 1
      }
    },
    {
      modelName: 'Post',
      values: {
        id: 4,
        title: 'Fourth',
        creator: 1
      }
    },
    {
      modelName: 'Post',
      values: {
        id: 5,
        title: 'Fifth',
        creator: 1
      }
    }
  ]

  specs.forEach(spec => session[spec.modelName].create(spec.values))

  const ACTION_NAME = 'ACTION_NAME'

  const state = {
    orm: session.state,
    queryResults: {
      [buildKey(ACTION_NAME)]: {
        ids: [5, 2, 3]
      }
    }
  }

  const resultsSelector = makeGetQueryResults(ACTION_NAME)

  it('returns the models in the right order', () => {
    const modelSelector = makeQueryResultsModelSelector(
      resultsSelector,
      'Post',
      post => ({
        ...post.ref,
        creator: post.creator
      }))

    const models = modelSelector(state)
    expect(models.length).toEqual(3)
    expect(models.map(m => m.id)).toEqual([5, 2, 3])
    expect(models[0].creator.name).toEqual('The Creator')
  })
})
