import { FlatList, TouchableOpacity } from 'react-native'
import React from 'react'
import ShallowRenderer from 'react-test-renderer/shallow'
import TestRenderer from 'react-test-renderer'
import { simulate } from 'util/testing'

import Loading from '../Loading'
import NotificationsList, { NotificationRow } from './NotificationsList'

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
      markActivityRead: jest.fn(),
      markAllRead: jest.fn(),
      pending: false,
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
    shallowRenderer.render(<NotificationsList {...props} />)
    const actual = shallowRenderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })

  it('returns Loading with no notifications when pending is true', () => {
    props.pending = true
    props.notifications = []
    shallowRenderer.render(<NotificationsList {...props} />)
    const actual = shallowRenderer.getRenderOutput()

    expect(actual).toEqual(<Loading />)
  })

  it('returns a message when no notifications are available', () => {
    props.notifications = []
    shallowRenderer.render(<NotificationsList {...props} />)
    const actual = shallowRenderer.getRenderOutput()
    expect(actual.props.children.includes('Nothing')).toBe(true)
  })

  it('marks the notification read on notification touch', () => {
    const notification = props.notifications[0]
    notification.unread = true
    const root = TestRenderer.create(<NotificationsList {...props} />).root
    simulate(root.findAllByType(TouchableOpacity)[0], 'press')
    expect(props.markActivityRead).toHaveBeenCalledWith(notification.activityId)
  })

  it('calls notification.onPress on notification touch', () => {
    const root = TestRenderer.create(<NotificationsList {...props} />).root
    const notification = root.props.notifications[0]
    simulate(root.findAllByType(TouchableOpacity)[0], 'press')
    expect(notification.onPress).toHaveBeenCalled()
  })

  it('calls fetchMore when scrolled to end of list', () => {
    const root = TestRenderer.create(<NotificationsList {...props} />).root
    simulate(root.findByType(FlatList), 'endReached')
    expect(props.fetchMore).toHaveBeenCalledWith(props.notifications.length)
  })

  it('matches the last snapshot for NotificationRow', () => {
    shallowRenderer.render(<NotificationRow
      markActivityRead={props.markActivityRead}
      notification={props.notifications[0]} />)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
})
