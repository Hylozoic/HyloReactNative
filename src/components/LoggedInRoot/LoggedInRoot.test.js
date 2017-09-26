import ReactShallowRenderer from 'react-test-renderer/shallow'
import LoggedInRoot from './LoggedInRoot'
import React from 'react'

jest.mock('react-native-google-signin')
jest.mock('react-native-zss-rich-text-editor')
jest.mock('react-native-onesignal', () => ({
  getPermissionSubscriptionState: jest.fn(() => Promise.resolve({userId: 5}))
}))

it('renders as expected', () => {
  const renderer = new ReactShallowRenderer()
  const fetchCurrentUser = jest.fn()
  const registerDevice = jest.fn()
  renderer.render(<LoggedInRoot {...{fetchCurrentUser, registerDevice}} />)
  const actual = renderer.getRenderOutput()
  expect(actual).toMatchSnapshot()

  // TODO: call componentDidMount and check that the mock functions were called
})
