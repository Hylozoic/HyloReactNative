import { mapStateToProps, mergeProps } from './CommunitySettings.connector'
import orm from '../../store/models'

let state

describe('CommunitySettings.connector', () => {
  let communityId
  beforeAll(() => {
    const session = orm.session(orm.getEmptyState())
    const community = session.Community.create({
      id: '99',
      slug: 'foo',
      name: 'Some Community Name',
      description: 'some community description',
      avatarUrl: 'someAvatarUrl',
      bannerUrl: 'someBannerUrl'
    })

    session.Me.create({
      id: '1',
      memberships: [session.Membership.create({
        id: '345',
        community: community.id,
        hasModeratorRole: true
      })]
    })

    session.Person.create({
      id: '1'
    })

    community.update({ moderators: ['1'] })

    state = {
      orm: session.state,
      ModeratorSettings: [],
      pending: {}
    }

    communityId = community.id
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
        fetchCommunitySettings: jest.fn(),
        updateCommunitySettings: jest.fn()
      }
      const mergedProps = mergeProps(stateProps, dispatchProps, ownProps)
      mergedProps.fetchCommunitySettings()
      expect(dispatchProps.fetchCommunitySettings).toHaveBeenCalledWith(communityId)

      mergedProps.updateCommunitySettings({ name: 'changedName' })
      expect(dispatchProps.updateCommunitySettings).toHaveBeenCalledWith(communityId, { name: 'changedName' })
    })
  })
})
