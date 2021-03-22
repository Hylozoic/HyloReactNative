import getCurrentGroupId from './getCurrentGroupId'
import orm from '../models'

describe('getCurrentGroupId', () => {
  let session
  beforeEach(() => {
    session = orm.session(orm.getEmptyState())
  })

  it('gets id from state', () => {
    const state = {
      orm: session.state,
      session: {
        groupId: 55
      }
    }
    const groupId = getCurrentGroupId(state)
    expect(groupId).toBe(55)
  })

  it('gets by current user', () => {
    const group1 = session.Group.create({ id: '55', slug: 'myslug' })
    session.Me.create({
      id: '10',
      memberships: [session.Membership.create({
        id: '345',
        group: group1.id,
        lastViewedAt: new Date(),
        hasModeratorRole: true
      })]
    })

    const state = { orm: session.state }
    const groupId = getCurrentGroupId(state)
    expect(groupId).toBe(group1.id)
  })
})
