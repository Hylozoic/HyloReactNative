import { mapStateToProps, mapDispatchToProps, mergeProps } from './InvitePeople.connector'
import orm from 'store/models'

jest.mock('store/selectors/getCurrentGroupId', () => () => 99)

let state

beforeAll(() => {
  const session = orm.session(orm.getEmptyState())
  const group = session.Group.create({ id: '99', slug: 'foo', inviteLink: '/38adslkjlkj3' })
  session.Group.create({ id: '88', slug: 'bar', inviteLink: '/dfaseadfd' })
  session.Invitation.create({ id: '33', email: 'john@doe.com', group: group.id })

  session.Me.create({
    id: '1',
    memberships: [session.Membership.create({
      id: '345',
      group: group.id,
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
      route: {
        params: { id: 1 }
      }
    }
    expect(mapStateToProps(state, props)).toMatchSnapshot()
  })
})

describe('mergeProps', () => {
  it('merges the props', () => {
    const dispatch = x => x
    const ownProps = {}
    const stateProps = mapStateToProps(state, { route: { params: { id: 1 } } })
    const dispatchProps = mapDispatchToProps(dispatch, stateProps)
    const mergedProps = mergeProps(stateProps, dispatchProps, ownProps)
    expect(mergedProps.fetchGroupSettings()).toMatchSnapshot()
    expect(mergedProps.regenerateAccessCode()).toMatchSnapshot()
    expect(mergedProps.createInvitations(['john@doe.com'], 'MyMessage')).toMatchSnapshot()
    expect(mergedProps.reinviteAll()).toMatchSnapshot()
    expect(mergedProps.expireInvitation(10)).toMatchSnapshot()
    expect(mergedProps.resendInvitation(10)).toMatchSnapshot()
    expect(mergedProps.setAllowGroupInvites(1, true)).toMatchSnapshot()
    expect(mergedProps).toMatchSnapshot()
  })
})
