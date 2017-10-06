import 'react-native'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'

import Loading from '../Loading'
import NotificationsList from './NotificationsList'

describe('NotificationsList', () => {
  let props = null
  let renderer = null

  beforeEach(() => {
    renderer = new ReactShallowRenderer()
    props = {
      fetchMore: () => {},
      fetchNotifications: () => {},
      hasMore: true,
      markActivityRead: () => {},
      pending: false,
      notifications: [
        {
          activityId: "1",
          actor: { avatarUrl: "https://wombat.com", name: "Wombat McAardvark" },
          avatarSeparator: false,
          createdAt: "2 min ago",
          id: "1",
          unread: false
        }
      ],
      setRightButton: () => {}
    }
  })

  it('matches the last snapshot', () => {
    renderer.render(<NotificationsList { ...props } />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })

  it('returns Loading with no notifications when pending is true', () => {
    props.pending = true
    props.notifications = []
    renderer.render(<NotificationsList { ...props } />)
    const actual = renderer.getRenderOutput()

    expect(actual).toEqual(<Loading />)
  })
})
