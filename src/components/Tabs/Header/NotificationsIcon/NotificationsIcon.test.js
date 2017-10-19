import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import NotificationsIcon from './index'

it('matches the last snapshot', () => {
  const renderer = new ReactShallowRenderer()
  renderer.render(<NotificationsIcon showNotifications={() => {}} />)
  const actual = renderer.getRenderOutput()
  expect(actual).toMatchSnapshot()
})
