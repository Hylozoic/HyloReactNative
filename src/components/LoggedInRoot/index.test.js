import Component from './index'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'

jest.mock('react-native-google-signin')
jest.mock('react-native-zss-rich-text-editor')
jest.mock('react-native-onesignal', () => ({
  getPermissionSubscriptionState: jest.fn(() => Promise.resolve({userId: 5}))
}))

it('renders as expected', () => {
  const renderer = new ReactShallowRenderer()
  const mockStore = {
    subscribe: jest.fn(),
    getState: jest.fn()
  }
  renderer.render(<Component store={mockStore} />)
  expect(renderer.getRenderOutput()).toMatchSnapshot()
})
