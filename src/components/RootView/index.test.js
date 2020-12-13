import React from 'react'
import { Provider } from 'react-redux'
import { createMockStore } from 'util/testing'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import RootView from 'components/RootView'

jest.mock('react-native-onesignal', () => ({
  addEventListener: jest.fn(),
  inFocusDisplaying: jest.fn(),
  clearOneSignalNotifications: jest.fn(),
  removeEventListener: jest.fn()
}))

describe('RootView', () => {
  const state = {
    pending: {}
  }

  it('matches the last snapshot (loading)', () => {
    const renderer = new ReactShallowRenderer()
    renderer.render(
      <Provider store={createMockStore(state)}>
        <RootView loading />
      </Provider>
    )
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })

  it('matches the last snapshot', () => {
    const renderer = new ReactShallowRenderer()
    renderer.render(
      <Provider store={createMockStore(state)}>
        <RootView />
      </Provider>
    )
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
