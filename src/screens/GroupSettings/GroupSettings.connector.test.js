import { mapStateToProps, mergeProps } from './GroupSettings.connector'
import orm from 'store/models'

let state

describe('GroupSettings.connector', () => {
  let groupId
  beforeAll(() => {
    const session = orm.session(orm.getEmptyState())
    const group = session.Group.create({
      id: '99',
      slug: 'foo',
      name: 'Some Group Name',
      description: 'some group description',
      avatarUrl: 'someAvatarUrl',
      bannerUrl: 'someBannerUrl'
    })

    session.Me.create({
      id: '1',
      memberships: [session.Membership.create({
        id: '345',
        group: group.id,
        hasModeratorRole: true
      })]
    })

    session.Person.create({
      id: '1'
    })

    group.update({ moderators: ['1'] })

    state = {
      orm: session.state,
      ModeratorSettings: [],
      pending: {}
    }

    groupId = group.id
  })

  describe('mapStateToProps', () => {
    it('works', () => {
      const props = {}

      expect(mapStateToProps(state, props)).toMatchSnapshot()
    })
  })

  describe('mergeProps', () => {
    it('merges the props', () => {
      const ownProps = {}
      const stateProps = mapStateToProps(state, {})
      const dispatchProps = {
        fetchGroupSettings: jest.fn(),
        updateGroupSettings: jest.fn()
      }
      const mergedProps = mergeProps(stateProps, dispatchProps, ownProps)
      mergedProps.fetchGroupSettings()
      expect(dispatchProps.fetchGroupSettings).toHaveBeenCalledWith(groupId)

      mergedProps.updateGroupSettings({ name: 'changedName' })
      expect(dispatchProps.updateGroupSettings).toHaveBeenCalledWith(groupId, { name: 'changedName' })
    })
  })
})
