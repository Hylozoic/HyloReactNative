import React from 'react'
import TestRenderer from 'react-test-renderer'
import RootView from './index'
import OneSignal from 'react-native-onesignal'
import SessionCheck from '../SessionCheck'

jest.mock('../../store', () => () => Promise.resolve({
  subscribe: jest.fn(),
  getState: jest.fn(() => ({})),
  dispatch: jest.fn(x => x)
}))

jest.mock('react-native-device-info')

jest.mock('react-native-onesignal', () => ({
  // this has to be set up here, not in a `.mockImplementation` call in a
  // `beforeEach` block, because it is called as soon as RootView is imported.
  addEventListener: jest.fn((name, callback) => {
    const mockNotificationEvent = {
      notification: {
        payload: {
          additionalData: {path: '/t/17'}
        }
      }
    }

    if (name === 'opened') callback(mockNotificationEvent)
  }),
  inFocusDisplaying: jest.fn()
}))

jest.mock('../VersionCheck', () => 'VersionCheck')
jest.mock('../LoadingModal', () => 'LoadingModal')
jest.mock('../RootNavigator', () => 'RootNavigator')

jest.mock('../SessionCheck/SessionCheck.store', () => ({
  checkSession: jest.fn(() => Promise.resolve({
    payload: true
  }))
}))

describe('RootView', () => {
  const eventListeners = []

  beforeEach(() => {
    OneSignal.addEventListener.mockImplementation((name, callback) => {
      if (!eventListeners[name]) eventListeners[name] = []
      eventListeners[name].push(callback)
    })
  })

  it('renders as expected when store is loaded', async () => {
    const renderer = await TestRenderer.create(<RootView />)
    expect(renderer).toMatchSnapshot()
    expect(OneSignal.inFocusDisplaying).toBeCalled()
    expect(OneSignal.addEventListener).toHaveBeenCalledTimes(2)

    const notificationHandler = eventListeners['received'][0]
    expect(notificationHandler({
      payload: {
        additionalData: {path: '/c/sandbox'}
      }
    })).toMatchSnapshot()

    const sessionCheck = renderer.root.findByType(SessionCheck)
    const { initialPushNotificationEvent } = sessionCheck.props.children.props
    expect(initialPushNotificationEvent).toEqual({
      notification: {
        payload: {
          additionalData: {path: '/t/17'}
        }
      }
    })
  })

  it('matches last snapshot without a store', () => {
    const renderer = TestRenderer.create(<RootView />)
    renderer.getInstance().setState({store: null})
    expect(renderer.toJSON()).toMatchSnapshot()
  })
})
