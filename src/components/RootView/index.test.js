import React from 'react'
import TestRenderer from 'react-test-renderer'
import RootView from './index'
import OneSignal from 'react-native-onesignal'

jest.mock('../../store', () => () => Promise.resolve({
  subscribe: jest.fn(),
  getState: jest.fn(() => ({})),
  dispatch: jest.fn()
}))

jest.mock('react-native-device-info')
jest.mock('NetInfo', () => ({
  isConnected: {
    addEventListener: jest.fn(),
    fetch: jest.fn()
  },
  fetch: jest.fn()
}))

jest.mock('react-native-onesignal', () => ({
  addEventListener: jest.fn(),
  inFocusDisplaying: jest.fn()
}))

jest.mock('../SessionCheck', () => 'SessionCheck')
jest.mock('../VersionCheck', () => 'VersionCheck')
jest.mock('../LoadingModal', () => 'LoadingModal')

describe('RootView', () => {
  it('renders as expected when store is loaded', async () => {
    const renderer = await TestRenderer.create(<RootView />)
    expect(renderer.toJSON()).toMatchSnapshot()
    expect(OneSignal.addEventListener).toBeCalled()
    expect(OneSignal.inFocusDisplaying).toBeCalled()
  })

  it('matches last snapshot without a store', () => {
    const renderer = TestRenderer.create(<RootView />)
    renderer.getInstance().setState({store: null})
    expect(renderer.toJSON()).toMatchSnapshot()
  })
})
