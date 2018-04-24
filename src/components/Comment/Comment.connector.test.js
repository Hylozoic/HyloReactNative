import { mapStateToProps, mergeProps } from './Comment.connector'
import orm from 'store/models'

let session, state

beforeEach(() => {
  session = orm.mutableSession(orm.getEmptyState())
  state = {orm: session.state}
})

describe('mapStateToProps', () => {
  it('maps', () => {
    const community = session.Community.create({id: '7', slug: 'world'})
    session.Me.create({
      name: 'me',
      id: 10,
      memberships: [session.Membership.create({
        id: '345',
        community: community.id,
        hasModeratorRole: true
      })]})

    const props = {
      slug: community.slug,
      comment: {
        creator: {
          id: 10
        }
      }
    }

    expect(mapStateToProps(state, props)).toEqual({
      canModerate: true,
      isCreator: true
    })
  })
})

describe('mergeProps', () => {
  const dispatchProps = {
    deleteComment: jest.fn()
  }

  it('returns removeComment when moderator', () => {
    const stateProps = {
      canModerate: true
    }
    const ownProps = {comment: {id: 34}}

    const mprops = mergeProps(stateProps, dispatchProps, ownProps)
    expect(mprops).toMatchSnapshot()

    expect(mprops.removeComment).toBeTruthy()
    expect(mprops.deleteComment).toBeFalsy()
  })

  it('return deleteComment when creator', () => {
    const stateProps = {
      isCreator: true,
      canModerate: true
    }
    const ownProps = {comment: {id: 34}}

    const mprops = mergeProps(stateProps, dispatchProps, ownProps)
    expect(mprops).toMatchSnapshot()

    expect(mprops.removeComment).toBeFalsy()
    expect(mprops.deleteComment).toBeTruthy()
  })

  it('returns nothing when neither creator nor moderator', () => {
    const stateProps = {
      canModerate: false,
      isCreator: false
    }
    const ownProps = {comment: {id: 34}}

    const mprops = mergeProps(stateProps, dispatchProps, ownProps)
    expect(mprops).toMatchSnapshot()

    expect(mprops.removeComment).toBeFalsy()
    expect(mprops.deleteComment).toBeFalsy()
  })
})
