import OneSignal from 'react-native-onesignal'
import React from 'react'
import { AppState } from 'react-native'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import TestRenderer from 'react-test-renderer'

import { createMockStore } from 'util/testing'
import RootView from './'

jest.mock('react-native-onesignal', () => ({
  addEventListener: jest.fn(),
  inFocusDisplaying: jest.fn(),
  clearOneSignalNotifications: jest.fn(),
  removeEventListener: jest.fn()
}))

jest.mock('../VersionCheck', () => 'VersionCheck')
jest.mock('../LoadingModal', () => 'LoadingModal')
jest.mock('../RootNavigator', () => 'RootNavigator')
jest.mock('../SessionCheck', () => 'SessionCheck')

describe('RootView', () => {
  it('matches the last snapshot with a store', () => {
    const renderer = new ReactShallowRenderer()
    renderer.render(<RootView store={createMockStore()} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })

  it('matches the last snapshot without a store', () => {
    const renderer = new ReactShallowRenderer()
    renderer.render(<RootView store={null} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })

  it('tidies up event handlers', () => {
    AppState.removeEventListener = jest.fn()
    const renderer = TestRenderer.create(<RootView store={null} />)
    const instance = renderer.getInstance()
    instance.componentWillUnmount()
    expect(OneSignal.removeEventListener).toHaveBeenCalled()
    expect(AppState.removeEventListener).toHaveBeenCalled()
  })

  it('stores the OneSignal payload in component state', () => {
    const renderer = TestRenderer.create(<RootView store={null} />)
    const instance = renderer.getInstance()
    const payload = { additionalData: { path: 'wombat' } }
    instance._handleOpenedPushNotification({ notification: { payload } })
    expect(instance.state.onesignalNotification).toEqual(payload)
  })

  describe('_handleAppStateChange', () => {
    it('changes state.appState', () => {
      const active = 'active'
      const inactive = 'inactive'
      const renderer = TestRenderer.create(<RootView store={createMockStore()} />)
      const instance = renderer.getInstance()
      instance.setState({appState: active})
      instance._handleAppStateChange(inactive)
      expect(instance.state.appState).toEqual(inactive)
    })

    it('changes appState from inactive to background', () => {
      const background = 'background'
      const active = 'active'
      const renderer = TestRenderer.create(<RootView store={createMockStore()} />)
      const instance = renderer.getInstance()
      instance.setState({appState: background})
      instance._handleAppStateChange(active)
      expect(instance.state.appState).toEqual(active)
      expect(OneSignal.clearOneSignalNotifications).toHaveBeenCalled()
    })
  })
})
