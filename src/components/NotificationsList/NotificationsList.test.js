import { FlatList, TouchableOpacity } from 'react-native'
import React from 'react'
import ShallowRenderer from 'react-test-renderer/shallow'

import TestRenderer from 'react-test-renderer'
import { simulate } from 'util/testing'
import { LoadingScreen } from '../Loading'
import NotificationsList, { NotificationRow } from './NotificationsList'

jest.mock('util/platform', () => ({isIOS: true}))

describe('NotificationsList', () => {
  let props = null
  let shallowRenderer = null

  beforeEach(() => {
    shallowRenderer = new ShallowRenderer()
    props = {
      fetchMore: jest.fn(),
      fetchNotifications: () => {},
      updateNewNotificationCount: () => {},
      hasMore: true,
      isFocused: true,
      markActivityRead: jest.fn(),
      markAllRead: jest.fn(),
      pending: false,
      currentUserHasMemberships: true,
      notifications: [
        {
          activityId: '1',
          actor: { avatarUrl: 'https://wombat.com', name: 'Wombat McAardvark' },
          avatarSeparator: false,
          createdAt: '2 min ago',
          id: '1',
          onPress: jest.fn(),
          unread: false
        }
      ],
      setRightButton: () => {}
    }
  })

  it('matches the last snapshot', () => {
    const renderer = TestRenderer.create(<NotificationsList {...props} />)
    renderer.getInstance().setState({ ready: true })
    expect(renderer.toJSON()).toMatchSnapshot()
  })

  it('returns Loading with no notifications when pending is true', () => {
    props.pending = true
    props.notifications = []
    shallowRenderer.render(<NotificationsList {...props} />)
    const actual = shallowRenderer.getRenderOutput()

    expect(actual).toEqual(<LoadingScreen />)
  })

  it('returns a message when no notifications are available', () => {
    props.notifications = []
    const renderer = TestRenderer.create(<NotificationsList {...props} />)
    renderer.getInstance().setState({ ready: true })
    const hasMessage = renderer.toJSON().children.find(c => c.includes('Nothing new'))
    expect(hasMessage).not.toBeFalsy()
  })

  it('marks the notification read on notification touch', () => {
    const notification = props.notifications[0]
    notification.unread = true
    const root = TestRenderer.create(<NotificationsList {...props} />).root
    root.instance.setState({ ready: true })
    simulate(root.findAllByType(TouchableOpacity)[0], 'press')
    expect(props.markActivityRead).toHaveBeenCalledWith(notification.activityId)
  })

  it('calls notification.onPress on notification touch', () => {
    const root = TestRenderer.create(<NotificationsList {...props} />).root
    root.instance.setState({ ready: true })
    const notification = root.props.notifications[0]
    simulate(root.findAllByType(TouchableOpacity)[0], 'press')
    expect(notification.onPress).toHaveBeenCalled()
  })

  it('calls fetchMore when scrolled to end of list', () => {
    const root = TestRenderer.create(<NotificationsList {...props} />).root
    root.instance.setState({ ready: true })
    simulate(root.findByType(FlatList), 'endReached')
    expect(props.fetchMore).toHaveBeenCalledWith(props.notifications.length)
  })

  it('matches the last snapshot for NotificationRow', () => {
    shallowRenderer.render(<NotificationRow
      markActivityRead={props.markActivityRead}
      notification={props.notifications[0]} />)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })

  it('matches the renders CreateCommunityNotice if user does not have memberships', () => {
    props['currentUserHasMemberships'] = false
    const renderer = TestRenderer.create(<NotificationsList {...props} />)
    renderer.getInstance().setState({ ready: true })
    expect(renderer.toJSON()).toMatchSnapshot()
  })
})
