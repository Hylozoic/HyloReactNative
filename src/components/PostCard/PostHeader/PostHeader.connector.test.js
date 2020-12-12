import { mapStateToProps, mapDispatchToProps, mergeProps } from './PostHeader.connector'
import orm from '../../../store/models'

describe('mapStateToProps', () => {
  it('maps', () => {
    const session = orm.session(orm.getEmptyState())
    session.Community.create({ id: 33, slug: 'mycommunity' })
    session.Me.create({
      id: 20,
      memberships: [session.Membership.create({
        id: '345',
        community: 33,
        hasModeratorRole: true
      })]
    })

    const state = {
      orm: session.state
    }

    const ownProps = { creator: { id: 20 }, slug: 'mycommunity' }
    const { community, currentUser, canModerate, isCreator, canEdit } = mapStateToProps(state, ownProps)

    expect(community.id).toBe(33)
    expect(currentUser.id).toBe(20)
    expect(isCreator).toBeTruthy()
    expect(canModerate).toBeTruthy()
    expect(canEdit).toBeTruthy()
  })

  it('cannot Flag when user is creator', () => {
    const session = orm.session(orm.getEmptyState())
    session.Me.create({ id: 20 })
    session.Community.create({ id: 33 })
    const state = {
      orm: session.state
    }

    const ownProps = { creator: { id: 20 } }
    const { canFlag } = mapStateToProps(state, ownProps)

    expect(canFlag).toBeFalsy()
  })

  it('can Flag when user is not creator', () => {
    const session = orm.session(orm.getEmptyState())
    session.Me.create({ id: 20 })
    session.Community.create({ id: 33 })
    const state = {
      orm: session.state
    }

    const ownProps = { creator: { id: 40 } }
    const { canFlag } = mapStateToProps(state, ownProps)

    expect(canFlag).toBeTruthy()
  })

  it('can edit post when user is creator', () => {
    const session = orm.session(orm.getEmptyState())
    session.Me.create({ id: 20 })
    session.Community.create({ id: 33 })
    const state = {
      orm: session.state
    }

    const propEditPost = jest.fn()

    const ownProps = { creator: { id: 20 }, editPost: propEditPost }
    const { canEdit } = mapStateToProps(state, ownProps)

    expect(canEdit).toBeTruthy()
  })

  it('cannot edit post when user is not creator', () => {
    const session = orm.session(orm.getEmptyState())
    session.Me.create({ id: 20 })
    session.Community.create({ id: 33 })
    const state = {
      orm: session.state
    }

    const ownProps = { creator: { id: 40 } }
    const { canEdit, editPost } = mapStateToProps(state, ownProps)

    expect(canEdit).toBeFalsy()
    expect(editPost).toBeFalsy()
  })
})

describe('mapDispatchToProps', () => {
  it('returns the right keys', () => {
    expect(mapDispatchToProps).toMatchSnapshot()
  })
})

describe('mergeProps', () => {
  const dispatchProps = {
    removePost: jest.fn(),
    deletePost: jest.fn()
  }

  beforeEach(() => {
    dispatchProps.removePost.mockReset()
    dispatchProps.deletePost.mockReset()
  })

  describe('as moderator', () => {
    it('can delete own posts', () => {
      const session = orm.session(orm.getEmptyState())
      const community = session.Community.create({ id: 33, slug: 'mycommunity' })
      session.Me.create({
        id: 20,
        memberships: [session.Membership.create({
          id: '345',
          community: community.id,
          hasModeratorRole: true
        })]
      })

      const state = {
        orm: session.state
      }

      const ownProps = { postId: 20, slug: 'mycommunity', creator: { id: 20 } }
      const stateProps = mapStateToProps(state, ownProps)

      const { deletePost, removePost } = mergeProps(stateProps, dispatchProps, ownProps)

      expect(deletePost).toBeTruthy()
      expect(removePost).toBeFalsy()

      deletePost()
      expect(dispatchProps.deletePost).toHaveBeenCalledWith(20)
    })

    it('cannot delete posts but can moderate', () => {
      const session = orm.session(orm.getEmptyState())
      const community = session.Community.create({ id: 33, slug: 'mycommunity' })
      session.Me.create({
        id: 20,
        memberships: [session.Membership.create({
          id: '345',
          community: community.id,
          hasModeratorRole: true
        })]
      })

      const state = {
        orm: session.state
      }

      const ownProps = { postId: 20, slug: 'mycommunity', creator: { id: 33 } }
      const stateProps = mapStateToProps(state, ownProps)

      const { deletePost, removePost } = mergeProps(stateProps, dispatchProps, ownProps)

      expect(deletePost).toBeFalsy()
      expect(removePost).toBeTruthy()

      removePost()
      expect(dispatchProps.removePost).toHaveBeenCalledWith(20, 'mycommunity')
    })
  })

  describe('as non-moderator', () => {
    it('can delete own posts', () => {
      const session = orm.session(orm.getEmptyState())
      const community = session.Community.create({ id: 33, slug: 'mycommunity' })
      session.Me.create({
        id: 20,
        memberships: [session.Membership.create({
          id: '345',
          community: community.id,
          hasModeratorRole: false
        })]
      })

      const state = {
        orm: session.state
      }

      const ownProps = { postId: 20, slug: 'mycommunity', creator: { id: 20 } }
      const stateProps = mapStateToProps(state, ownProps)

      const { deletePost, removePost } = mergeProps(stateProps, dispatchProps, ownProps)

      expect(deletePost).toBeTruthy()
      expect(removePost).toBeFalsy()

      deletePost()
      expect(dispatchProps.deletePost).toHaveBeenCalledWith(20)
    })
  })

  it('cannot delete or remove posts if not creator or moderator', () => {
    const session = orm.session(orm.getEmptyState())
    const community = session.Community.create({ id: 33, slug: 'mycommunity' })
    session.Me.create({
      id: 20,
      memberships: [session.Membership.create({
        id: '345',
        community: community.id,
        hasModeratorRole: false
      })]
    })

    const state = {
      orm: session.state
    }

    const ownProps = { postId: 20, slug: 'mycommunity', creator: { id: 33 } }
    const stateProps = mapStateToProps(state, ownProps)

    const { deletePost, removePost } = mergeProps(stateProps, dispatchProps, ownProps)

    expect(deletePost).toBeFalsy()
    expect(removePost).toBeFalsy()
  })
})
