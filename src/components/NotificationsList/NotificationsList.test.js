import 'react-native'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'

import NotificationsList from './NotificationsList'

describe('NotificationsList', () => {
  it('matches the last snapshot', () => {
    const renderer = new ReactShallowRenderer()
    const notifications = [
      {
        activityId: "1",
        actor: { avatarUrl: "https://wombat.com", name: "Wombat McAardvark" },
        avatarSeparator: false,
        createdAt: "2 min ago",
        id: "1",
        unread: false
      }
    ]
    renderer.render(<NotificationsList notifications={notifications} />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })
})
