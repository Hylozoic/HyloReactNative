import orm from '../../store/models'
import { mapStateToProps, mapDispatchToProps } from './NotificationsList.connector'
import { FETCH_NOTIFICATIONS } from './NotificationsList.store'
import { buildKey } from '../../store/reducers/queryResults'

jest.mock('util/platform', () => ({isIOS: true}))

it('matches the last snapshot for mapStateToProps', () => {
  const session = orm.mutableSession(orm.getEmptyState())
  session.Activity.create({
    actor: '1',
    comment: '1',
    createdAt: 'Wed Oct 04 2017 00:06:56 GMT+1300 (NZDT)',
    id: '1',
    post: '1',
    unread: false,
    meta: {
      reasons: ['announcement']
    }
  })
  session.Comment.create({ id: '1' })
  session.Notification.create({ id: '1', activity: '1' })
  session.Person.create({ id: '1', avatarUrl: 'https://wombat.com', name: 'Wombat McAardvark' })
  session.Post.create({ id: '1', creator: '1' })
  const key = buildKey(FETCH_NOTIFICATIONS)
  const state = {
    orm: session.state,
    pending: { [ FETCH_NOTIFICATIONS ]: false },
    queryResults: { [ key ]: { hasMore: false } }
  }
  const props = { navigation: { navigate: () => {} } }

  expect(mapStateToProps(state, props)).toMatchSnapshot()
})

it('matches the last snapshot for mapDispatchToProps', () => {
  const dispatch = jest.fn()
  const props = { navigation: { setParams: jest.fn() } }
  const dispatchProps = mapDispatchToProps(dispatch, props)
  expect(dispatchProps).toMatchSnapshot()
  dispatchProps.setRightButton()
  expect(props.navigation.setParams.mock.calls).toMatchSnapshot()
  dispatchProps.updateNewNotificationCount()
  expect(dispatch.mock.calls).toMatchSnapshot()
})
