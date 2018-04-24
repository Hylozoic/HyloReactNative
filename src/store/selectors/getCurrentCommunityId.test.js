import getCurrentCommunityId from './getCurrentCommunityId'
import orm from '../models'

describe('getCurrentCommunityId', () => {
  let session
  beforeEach(() => {
    session = orm.session(orm.getEmptyState())
  })

  it('gets id from state', () => {
    const state = {
      currentNetworkAndCommunity: {
        communityId: 55
      }
    }
    const communityId = getCurrentCommunityId(state)
    expect(communityId).toBe(55)
  })

  it('gets by current user', () => {
    const community1 = session.Community.create({ id: '55', slug: 'myslug' })
    session.Me.create({
      id: '10',
      memberships: [session.Membership.create({
        id: '345',
        community: community1.id,
        lastViewedAt: new Date(),
        hasModeratorRole: true
      })]})

    const state = {orm: session.state}
    const communityId = getCurrentCommunityId(state)
    expect(communityId).toBe(community1.id)
  })
})
