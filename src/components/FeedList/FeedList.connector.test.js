import orm from '../../store/models'
import { buildKey } from '../../store/reducers/queryResults'
import { times } from 'lodash/fp'
import { mapStateToProps, mergeProps, shouldResetNewPostCount } from './FeedList.connector'
import { MODULE_NAME, defaultState, defaultSortBy } from './FeedList.store'
import { FETCH_POSTS } from '../../store/actions/fetchPosts'

describe('mapStateToProps', () => {
  let state

  beforeEach(() => {
    const session = orm.session(orm.getEmptyState())

    times(i => {
      session.Post.create({id: i.toString(), communities: ['1']})
    }, 5)

    state = {
      orm: session.state,
      pending: {},
      [MODULE_NAME]: defaultState,
      queryResults: {
        [buildKey(FETCH_POSTS, {...defaultState, slug: 'foo'})]: {
          ids: ['1', '3', '2'],
          hasMore: true
        }
      }
    }
  })

  it('returns empty posts and default query props if no results exist', () => {
    expect(mapStateToProps(state, {id: 'bar'})).toEqual({
      posts: [],
      hasMore: undefined,
      pending: false,
      pendingRefresh: false,
      filter: defaultState.filter,
      sortBy: defaultState.sortBy,
      queryProps: {
        slug: 'all-communities',
        sortBy: 'updated',
        subject: 'all-communities'
      }
    })
  })

  it('returns posts in the correct order', () => {
    expect(mapStateToProps(state, {community: {slug: 'foo'}})).toEqual({
      posts: [
        expect.objectContaining({id: '1'}),
        expect.objectContaining({id: '3'}),
        expect.objectContaining({id: '2'})
      ],
      hasMore: true,
      pending: false,
      pendingRefresh: false,
      filter: defaultState.filter,
      sortBy: defaultState.sortBy,
      queryProps: {
        subject: 'community',
        slug: 'foo',
        sortBy: 'updated'
      }
    })
  })

  // it('returns posts for a network ', () => {
  //   expect(mapStateToProps(state, {community: {slug: 'foo'}})).toEqual({
  //     posts: [
  //       expect.objectContaining({id: '1'}),
  //       expect.objectContaining({id: '3'}),
  //       expect.objectContaining({id: '2'})
  //     ],
  //     hasMore: true,
  //     pending: false,
  //     pendingRefresh: false,
  //     filter: defaultState.filter,
  //     sortBy: defaultState.sortBy,
  //     queryProps: {
  //       subject: 'community',
  //       slug: 'foo',
  //       sortBy: 'updated'
  //     }
  //   })
  // })

  it('checks if FETCH_POSTS is pending', () => {
    state = {
      ...state,
      pending: {[FETCH_POSTS]: {extractQueryResults: {}}}
    }
    const result = mapStateToProps(state, {id: 'foo'})
    expect(result).toMatchObject({pending: true})
  })
})

describe('mergeProps', () => {
  it('sets up fetchPostsAndResetCount', () => {
    const stateProps = {
      queryProps: {
        subject: 'community',
        sortBy: defaultSortBy
      }
    }

    const dispatchProps = {
      resetNewPostCount: jest.fn(),
      fetchPosts: jest.fn()
    }

    const ownProps = {
      community: {
        id: 1
      }
    }

    const merged = mergeProps(stateProps, dispatchProps, ownProps)
    return merged.fetchPosts()
    .then(() => {
      expect(dispatchProps.fetchPosts).toHaveBeenCalledWith({
        sortBy: 'updated', subject: 'community'
      }, undefined)
      expect(dispatchProps.resetNewPostCount).toHaveBeenCalledWith(ownProps.community.id, 'Membership')
    })
  })

  it('sets up fetchPostsAndResetCount without calling resetNewPostCount', () => {
    const stateProps = {
      queryProps: {
        subject: 'community',
        sortBy: defaultSortBy,
        filter: 'some filter'
      }
    }

    const dispatchProps = {
      resetNewPostCount: jest.fn(),
      fetchPosts: jest.fn()
    }

    const ownProps = {
      community: {
        id: 1
      }
    }

    const merged = mergeProps(stateProps, dispatchProps, ownProps)
    return merged.fetchPosts()
    .then(() => {
      expect(dispatchProps.fetchPosts).toHaveBeenCalledWith({
        sortBy: 'updated', subject: 'community', filter: 'some filter'
      }, undefined)
      expect(dispatchProps.resetNewPostCount).not.toHaveBeenCalled()
    })
  })

  it('binds the correct values to fetchPosts', () => {
    const stateProps = {
      sortBy: 'latest',
      filter: 'request',
      hasMore: true,
      posts: [1, 2, 3, 4],
      queryProps: {
        subject: 'community',
        slug: 'food',
        sortBy: 'latest',
        filter: 'request',
        topic: 'eggs'
      }
    }

    const ownProps = {
      community: {
        id: 1
      }
    }
    const fetchPosts = jest.fn()
    const dispatchProps = {fetchPosts}
    const merged = mergeProps(stateProps, dispatchProps, ownProps)

    merged.fetchPosts()
    expect(fetchPosts).toHaveBeenCalledWith({
      filter: stateProps.filter,
      sortBy: stateProps.sortBy,
      slug: 'food',
      subject: 'community',
      topic: 'eggs'
    }, undefined)
    fetchPosts.mockClear()

    merged.fetchMorePosts()
    expect(fetchPosts).toHaveBeenCalledWith({
      filter: stateProps.filter,
      sortBy: stateProps.sortBy,
      slug: 'food',
      subject: 'community',
      offset: 4,
      topic: 'eggs'
    })
    fetchPosts.mockClear()

    const merged2 = mergeProps(
      {
        ...stateProps,
        hasMore: false,
        queryProps: {
          filter: 'foo',
          sortBy: 'bar',
          slug: 'all-communities',
          subject: 'all-communities'
        }
      },
      dispatchProps,
      ownProps
    )

    merged2.fetchPosts()
    expect(fetchPosts).toHaveBeenCalledWith({
      filter: 'foo',
      sortBy: 'bar',
      slug: 'all-communities',
      subject: 'all-communities'
    }, undefined)
    fetchPosts.mockClear()

    merged2.fetchMorePosts()
    expect(fetchPosts).not.toHaveBeenCalled()
  })
})

describe('shouldResetNewPostCount', () => {
  it('returns true appropriately', () => {
    const props = {
      subject: 'community',
      sortBy: defaultSortBy
    }
    expect(shouldResetNewPostCount(props)).toEqual(true)
  })
  it('returns false with a subject that does not equal "community"', () => {
    let props = {
      subject: 'all communities',
      sortBy: defaultSortBy
    }
    expect(shouldResetNewPostCount(props)).toEqual(false)
  })
  it('returns false with a non-default sortBy', () => {
    let props = {
      subject: 'community',
      sortBy: 'non-default'
    }
    expect(shouldResetNewPostCount(props)).toEqual(false)
  })
  it('returns false with a filter', () => {
    let props = {
      subject: 'community',
      sortBy: defaultSortBy,
      filter: 'any filter'
    }
    expect(shouldResetNewPostCount(props)).toEqual(false)
  })
  it('returns false with a topic', () => {
    let props = {
      subject: 'community',
      sortBy: defaultSortBy,
      topic: 'any topic'
    }
    expect(shouldResetNewPostCount(props)).toEqual(false)
  })
})
