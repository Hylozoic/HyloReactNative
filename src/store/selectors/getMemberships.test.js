import getMemberships from './getMemberships'
import orm from '../models'

it('gets all communities on current user', () => {
  const session = orm.mutableSession(orm.getEmptyState())
  const meId = 'meId'
  const community1Id = 'community1Id'
  const community2Id = 'community2Id'
  const membership1Id = 'membership1Id'
  const membership2Id = 'membership2Id'

  const me = session.Me.create({ id: meId })
  session.Community.create({ id: community1Id, name: 'community 1' })
  session.Community.create({ id: community2Id, name: 'community 2' })
  session.Membership.create({ id: membership1Id, community: community1Id, person: meId })
  session.Membership.create({ id: membership2Id, community: community2Id, person: meId })
  me.updateAppending({ memberships: [membership1Id, membership2Id] })

  const state = { orm: session.state }

  expect(getMemberships(state)).toMatchSnapshot()
})
