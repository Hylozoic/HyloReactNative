import orm from '../../store/models'
import { buildKey } from '../../reducer/queryResults'
import { times } from 'lodash/fp'
import { mapStateToProps, mergeProps } from './FeedList.connector'
import { MODULE_NAME, defaultState, FETCH_POSTS } from './FeedList.store'

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

  it('returns empty posts if no results exist', () => {
    expect(mapStateToProps(state, {id: 'bar'})).toEqual({
      posts: [],
      hasMore: undefined,
      pending: undefined,
      filter: defaultState.filter,
      sortBy: defaultState.sortBy
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
      pending: undefined,
      filter: defaultState.filter,
      sortBy: defaultState.sortBy
    })
  })

  it('checks if FETCH_POSTS is pending', () => {
    state = {
      ...state,
      pending: {[FETCH_POSTS]: true}
    }
    const result = mapStateToProps(state, {id: 'foo'})
    expect(result).toMatchObject({pending: true})
  })
})

describe('mergeProps', () => {
  it('binds the correct values to fetchPostsRaw', () => {
    const fetchPostsRaw = jest.fn()
    const stateProps = {
      sortBy: 'latest',
      filter: 'request',
      hasMore: true,
      posts: [1, 2, 3, 4]
    }
    const dispatchProps = {
      fetchPostsRaw
    }
    const ownProps = {
      community: {
        slug: 'food'
      }
    }

    const merged = mergeProps(stateProps, dispatchProps, ownProps)

    merged.fetchPosts()
    expect(fetchPostsRaw).toHaveBeenCalledWith({
      filter: stateProps.filter,
      sortBy: stateProps.sortBy,
      slug: ownProps.community.slug,
      subject: 'community'
    })
    fetchPostsRaw.mockClear()

    merged.fetchMorePosts()
    expect(fetchPostsRaw).toHaveBeenCalledWith({
      filter: stateProps.filter,
      sortBy: stateProps.sortBy,
      slug: ownProps.community.slug,
      subject: 'community',
      offset: 4
    })
    fetchPostsRaw.mockClear()

    const merged2 = mergeProps(
      {...stateProps, hasMore: false},
      dispatchProps,
      {}
    )

    merged2.fetchPosts()
    expect(fetchPostsRaw).toHaveBeenCalledWith({
      filter: stateProps.filter,
      sortBy: stateProps.sortBy,
      slug: 'all-communities',
      subject: 'all-communities'
    })
    fetchPostsRaw.mockClear()

    merged2.fetchMorePosts()
    expect(fetchPostsRaw).not.toHaveBeenCalled()
  })
})
