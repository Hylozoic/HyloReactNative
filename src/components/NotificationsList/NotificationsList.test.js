import 'react-native'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'

import NotificationsList from './NotificationsList'

describe('NotificationsList', () => {
  it('matches the last snapshot', () => {
    const renderer = new ReactShallowRenderer()
    const notifications = [{id: 1}]
    renderer.render(<NotificationsList notifications={notifications} />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })

  // it('handles pending correctly without notifications', () => {
  //   const renderer = new ReactShallowRenderer()
  //   const notifications = []
  //   const pending = true
  //   renderer.render(<NotificationsList notifications={notifications} pending={pending} />)
  //   const actual = renderer.getRenderOutput()
  //
  //   expect(actual).toMatchSnapshot()
  // })
  //
  // it('handles pending correctly with notifications', () => {
  //   const renderer = new ReactShallowRenderer()
  //   const notifications = {id: 1}
  //   const pending = true
  //   renderer.render(<NotificationsList notifications={notifications} pending={pending} />)
  //   const actual = renderer.getRenderOutput()
  //
  //   expect(actual).toMatchSnapshot()
  // })
  // it('handles when there are no notifications correctly', () => {
  //   const renderer = new ReactShallowRenderer()
  //   const notifications = []
  //   const pending = false
  //   renderer.render(<NotificationsList notifications={notifications} pending={pending} />)
  //   const actual = renderer.getRenderOutput()
  //
  //   expect(actual).toMatchSnapshot()
  // })
})
