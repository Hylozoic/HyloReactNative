import orm from '../../store/models'
import { mapStateToProps, mapDispatchToProps } from './NotificationsList.connector'
import { FETCH_NOTIFICATIONS } from './NotificationsList.store'
import { buildKey } from '../../store/reducers/queryResults'

it('matches the last snapshot for mapStateToProps', () => {
  const session = orm.mutableSession(orm.getEmptyState())
  session.Activity.create({
    actor: '1',
    comment: '1',
    createdAt: 'Wed Oct 04 2017 00:06:56 GMT+1300 (NZDT)',
    id: '1',
    post: '1',
    unread: false
  })
  session.Comment.create({ id: '1' })
  session.Notification.create({ id: '1', activity: '1' })
  session.Person.create({ id: '1', avatarUrl: 'https://wombat.com', name: 'Wombat McAardvark' })
  session.Post.create({ id: '1', creator: '1' })
  const key = buildKey(FETCH_NOTIFICATIONS)
  state = {
    orm: session.state,
    pending: { [ FETCH_NOTIFICATIONS ]: false },
    queryResults: { [ key ]: { hasMore: false } }
  }
  const props = { navigation: { navigate: () => {} } }

  expect(mapStateToProps(state, props)).toMatchSnapshot()
})

it('matches the last snapshot for mapDispatchToProps', () => {
  const dispatch = () => {}
  const props = { navigation: { navigate: () => {} } }
  expect(mapDispatchToProps(dispatch, props)).toMatchSnapshot()
})
