import 'react-native'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import NotificationCard from './NotificationCard'

it('matches the last snapshot', () => {
  const notification = {
    id: '55905',
    creator: {
      id: '86894',
      avatarUrl: 'https://wombat.com/test.jpg'
    },
    text: 'Hi',
    createdAt: '1 mo ago'
  }
  const renderer = new ReactShallowRenderer()
  renderer.render(<NotificationCard { ...notification } />)
  expect(renderer.getRenderOutput()).toMatchSnapshot()
})
