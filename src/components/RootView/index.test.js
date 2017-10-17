import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import RootView from './index'

jest.mock('react-native-device-info')
jest.mock('NetInfo', () => ({
  isConnected: {
    addEventListener: jest.fn(),
    fetch: jest.fn()
  },
  fetch: jest.fn()
}))
jest.mock('react-native-onesignal', () => ({
  getPermissionSubscriptionState: jest.fn(() => Promise.resolve({userId: 5}))
}))

describe('RootView', () => {
  it('matches last snapshot with a forced version update', () => {
    const renderer = new ReactShallowRenderer()
    renderer.render(<RootView />)
    const actual = renderer.getRenderOutput()
    expect(actual).toMatchSnapshot()
  })
})
