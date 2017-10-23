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
      comment: {
        creator: {
          id: 10
        }
      }
    }

    expect(mapStateToProps(state, props)).toEqual({
      canModerate: true
    })
  })
})

describe('mergeProps', () => {
  const dispatchProps = {
    deleteComment: jest.fn()
  }

  it('returns deleteComment when moderator', () => {
    const stateProps = {
      canModerate: true
    }
    const ownProps = {comment: {id: 34}}
    expect(mergeProps(stateProps, dispatchProps, ownProps)).toMatchSnapshot()
  })

  it('doesnt return deleteComment when moderator', () => {
    const stateProps = {
      canModerate: false
    }
    const ownProps = {comment: {id: 34}}
    expect(mergeProps(stateProps, dispatchProps, ownProps)).toMatchSnapshot()
  })
})
