import orm from 'store/models'
import { buildKey } from 'store/reducers/queryResults'
import { times } from 'lodash/fp'
import { mapStateToProps, mergeProps, shouldResetNewPostCount } from './FeedList.connector'
import { MODULE_NAME, initialState, defaultSortBy } from './FeedList.store'
import { FETCH_POSTS } from 'store/constants'
import { ALL_GROUP_ID } from 'store/models/Group'

describe('mapStateToProps', () => {
  let state

  beforeEach(() => {
    const session = orm.session(orm.getEmptyState())

    times(i => {
      session.Post.create({ id: i.toString(), groups: ['1'] })
    }, 5)

    console.log("buildKey", buildKey(FETCH_POSTS, { ...initialState, context: 'groups', slug: 'foo', filter: null }))

    state = {
      orm: session.state,
      pending: {},
      [MODULE_NAME]: initialState,
      queryResults: {
        [buildKey(FETCH_POSTS, { ...initialState, context: 'groups', slug: 'foo', filter: null })]: {
          ids: ['1', '3', '2'],
          hasMore: true
        }
      }
    }
  })

  it('returns empty posts and default query props if no results exist', () => {
    expect(mapStateToProps(state, { forGroup: { id: 'bar' } })).toEqual({
      postIds: [],
      hasMore: undefined,
      pending: false,
      pendingRefresh: false,
      filter: initialState.filter,
      sortBy: initialState.sortBy,
      timeframe: 'future',
      fetchPostParam: {
        context: 'groups',
        sortBy: 'updated'
      }
    })
  })

  it('returns posts in the correct order', () => {
    const result = mapStateToProps(state, { forGroup: { slug: 'foo', sortBy: 'updated' } })

    expect(result).toEqual({
      postIds: [
        '1',
        '3',
        '2'
      ],
      hasMore: true,
      pending: false,
      pendingRefresh: false,
      filter: initialState.filter,
      sortBy: initialState.sortBy,
      timeframe: 'future',
      fetchPostParam: {
        context: 'groups',
        slug: 'foo',
        sortBy: 'updated'
      }
    })
  })

  it('checks if FETCH_POSTS is pending', () => {
    state = {
      ...state,
      pending: { [FETCH_POSTS]: { extractQueryResults: {} } }
    }
    const result = mapStateToProps(state, { id: 'foo' })
    expect(result).toMatchObject({ pending: true })
  })
})

describe('mergeProps', () => {
  it('sets up fetchPostsAndResetCount', () => {
    const stateProps = {
      fetchPostParam: {
        sortBy: defaultSortBy
      }
    }

    const dispatchProps = {
      resetNewPostCount: jest.fn(),
      fetchPosts: jest.fn()
    }

    const ownProps = {
      forGroup: {
        id: 1
      }
    }

    const merged = mergeProps(stateProps, dispatchProps, ownProps)
    return merged.fetchPosts()
      .then(() => {
        expect(dispatchProps.fetchPosts).toHaveBeenCalledWith({
          sortBy: 'updated'
        }, undefined)
        expect(dispatchProps.resetNewPostCount).toHaveBeenCalledWith(ownProps.forGroup.id, 'Membership')
      })
  })

  it('sets up fetchPostsAndResetCount without calling resetNewPostCount', () => {
    const stateProps = {
      fetchPostParam: {
        sortBy: defaultSortBy,
        filter: 'some filter'
      }
    }

    const dispatchProps = {
      resetNewPostCount: jest.fn(),
      fetchPosts: jest.fn()
    }

    const ownProps = {
      group: {
        id: 1,
        slug: 'test-group'
      }
    }

    const merged = mergeProps(stateProps, dispatchProps, ownProps)
    return merged.fetchPosts()
      .then(() => {
        expect(dispatchProps.fetchPosts).toHaveBeenCalledWith({
          sortBy: 'updated', filter: 'some filter'
        }, undefined)
        expect(dispatchProps.resetNewPostCount).not.toHaveBeenCalled()
      })
  })

  it('binds the correct values to fetchPosts', () => {
    const stateProps = {
      sortBy: 'latest',
      filter: 'request',
      hasMore: true,
      postIds: [1, 2, 3, 4],
      fetchPostParam: {
        slug: 'food',
        sortBy: 'latest',
        filter: 'request',
        topic: 'eggs'
      }
    }

    const ownProps = {
      group: {
        id: 1
      }
    }
    const fetchPosts = jest.fn()
    const dispatchProps = { fetchPosts }
    const merged = mergeProps(stateProps, dispatchProps, ownProps)

    merged.fetchPosts()
    expect(fetchPosts).toHaveBeenCalledWith({
      filter: stateProps.filter,
      sortBy: stateProps.sortBy,
      slug: 'food',
      topic: 'eggs'
    }, undefined)
    fetchPosts.mockClear()

    merged.fetchMorePosts()
    expect(fetchPosts).toHaveBeenCalledWith({
      filter: stateProps.filter,
      sortBy: stateProps.sortBy,
      slug: 'food',
      offset: 4,
      topic: 'eggs'
    })
    fetchPosts.mockClear()

    const merged2 = mergeProps(
      {
        ...stateProps,
        hasMore: false,
        fetchPostParam: {
          filter: 'foo',
          sortBy: 'bar',
          slug: ALL_GROUP_ID
        }
      },
      dispatchProps,
      ownProps
    )

    merged2.fetchPosts()
    expect(fetchPosts).toHaveBeenCalledWith({
      filter: 'foo',
      sortBy: 'bar',
      slug: ALL_GROUP_ID
    }, undefined)
    fetchPosts.mockClear()

    merged2.fetchMorePosts()
    expect(fetchPosts).not.toHaveBeenCalled()
  })
})

describe('shouldResetNewPostCount', () => {
  it('returns true appropriately', () => {
    const props = {
      sortBy: defaultSortBy
    }
    expect(shouldResetNewPostCount(props)).toEqual(true)
  })
  it('returns false if not a real "group"', () => {
    const props = {
      slug: ALL_GROUP_ID,
      sortBy: defaultSortBy
    }
    expect(shouldResetNewPostCount(props)).toEqual(false)
  })
  it('returns false with a non-default sortBy', () => {
    const props = {
      sortBy: 'non-default'
    }
    expect(shouldResetNewPostCount(props)).toEqual(false)
  })
  it('returns false with a filter', () => {
    const props = {
      sortBy: defaultSortBy,
      filter: 'any filter'
    }
    expect(shouldResetNewPostCount(props)).toEqual(false)
  })
  it('returns false with a topic', () => {
    const props = {
      sortBy: defaultSortBy,
      topic: 'any topic'
    }
    expect(shouldResetNewPostCount(props)).toEqual(false)
  })
})
