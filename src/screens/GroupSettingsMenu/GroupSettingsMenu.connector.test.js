import {
  mapStateToProps
} from './GroupSettingsMenu.connector'

import orm from 'store/models'

it('mapStateToProps matches the latest snapshot', () => {
  const session = orm.session(orm.getEmptyState())
  const group = session.Group.create({ id: '99', name: 'bar', slug: 'foo' })

  session.Me.create({
    id: '1',
    memberships: [session.Membership.create({
      id: '345',
      group: group.id,
      hasModeratorRole: true
    })]
  })

  const state = {
    orm: session.state,
    pending: {}
  }
  expect(mapStateToProps(state, {})).toMatchSnapshot()
})
