import React from 'react'
import TestRenderer from 'react-test-renderer'
import RootView from './index'
import OneSignal from 'react-native-onesignal'

jest.mock('../../store', () => () => Promise.resolve({
  subscribe: jest.fn(),
  getState: jest.fn(() => ({})),
  dispatch: jest.fn(x => x)
}))

jest.mock('react-native-device-info')
jest.mock('NetInfo', () => ({
  isConnected: {
    addEventListener: jest.fn(),
    fetch: jest.fn()
  },
  fetch: jest.fn()
}))

jest.mock('react-native-onesignal', () => {
  const eventListeners = {}
  return {
    eventListeners,
    addEventListener: jest.fn((name, callback) => {
      if (!eventListeners[name]) eventListeners[name] = []
      eventListeners[name].push(callback)
    }),
    inFocusDisplaying: jest.fn()
  }
})

jest.mock('../VersionCheck', () => 'VersionCheck')
jest.mock('../LoadingModal', () => 'LoadingModal')
jest.mock('../redirectsAfterLogin/NavigationContext', () => 'NavigationContext')

describe('RootView', () => {
  it('renders as expected when store is loaded', async () => {
    const renderer = await TestRenderer.create(<RootView />)
    expect(renderer).toMatchSnapshot()
    expect(OneSignal.inFocusDisplaying).toBeCalled()
    expect(OneSignal.addEventListener).toBeCalled()
    expect(OneSignal.eventListeners['received']).toHaveLength(1)
    const notification = {
      payload: {
        additionalData: {
          path: '/c/sandbox'
        }
      }
    }
    expect(OneSignal.eventListeners.received[0](notification)).toMatchSnapshot()
  })

  it('matches last snapshot without a store', () => {
    const renderer = TestRenderer.create(<RootView />)
    renderer.getInstance().setState({store: null})
    expect(renderer.toJSON()).toMatchSnapshot()
  })
})
