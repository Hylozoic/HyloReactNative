import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import ReactTestRenderer from 'react-test-renderer'
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

jest.mock('react-redux', () => ({
  Provider: ({ children }) => children
}))

jest.mock('../Login', () => 'Login')
jest.mock('../CheckInvitation', () => 'CheckInvitation')
jest.mock('../SocketListener', () => 'SocketListener')
jest.mock('../LoginNavigator', () => 'LoginNavigator')
jest.mock('../SessionCheck', () => 'SessionCheck')
jest.mock('../VersionCheck', () => 'VersionCheck')
jest.mock('../LoadingModal', () => 'LoadingModal')

describe('RootView', () => {
  it('matches last snapshot with a store', () => {
    const renderer = ReactTestRenderer.create(<RootView />)
    const instance = renderer.getInstance()
    instance.setState({store: {}})
    expect(renderer.toJSON()).toMatchSnapshot()
  })

  it('matches last snapshot without a store', () => {
    const renderer = ReactTestRenderer.create(<RootView />)
    const instance = renderer.getInstance()
    instance.setState({store: null})
    expect(renderer.toJSON()).toMatchSnapshot()
  })
})
