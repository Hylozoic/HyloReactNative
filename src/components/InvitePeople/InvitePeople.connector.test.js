import { mapStateToProps, mapDispatchToProps, mergeProps } from './InvitePeople.connector'
import orm from 'store/models'

let state
beforeAll(() => {
  const session = orm.session(orm.getEmptyState())
  const community = session.Community.create({id: '99', slug: 'foo', inviteLink: '/38adslkjlkj3'})
  session.Community.create({id: '88', slug: 'bar', inviteLink: '/dfaseadfd'})
  session.Invitation.create({id: '33', email: 'john@doe.com', community: community.id})

  session.Me.create({
    id: '1',
    memberships: [session.Membership.create({
      id: '345',
      community: community.id,
      hasModeratorRole: true
    })]
  })

  state = {
    orm: session.state,
    pending: {}
  }
})

describe('mapStateToProps', () => {
  it('returns the right keys', () => {
    const props = {
      navigation: {state: {params: {id: 1}}}
    }
    expect(mapStateToProps(state, props)).toMatchSnapshot()
  })
})

describe('mergeProps', () => {
  it('merges the props', () => {
    const dispatch = x => x
    const ownProps = {}
    const stateProps = mapStateToProps(state, {navigation: {state: {params: {id: 1}}}})
    const dispatchProps = mapDispatchToProps(dispatch, stateProps)
    const mergedProps = mergeProps(stateProps, dispatchProps, ownProps)
    expect(mergedProps.fetchCommunitySettings()).toMatchSnapshot()
    expect(mergedProps.regenerateAccessCode()).toMatchSnapshot()
    expect(mergedProps.createInvitations(['john@doe.com'], 'MyMessage')).toMatchSnapshot()
    expect(mergedProps.reinviteAll()).toMatchSnapshot()
    expect(mergedProps.expireInvitation(10)).toMatchSnapshot()
    expect(mergedProps.resendInvitation(10)).toMatchSnapshot()
    expect(mergedProps).toMatchSnapshot()
  })
})
