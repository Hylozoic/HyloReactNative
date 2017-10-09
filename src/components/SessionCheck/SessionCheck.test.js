import 'react-native'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import SessionCheck from './SessionCheck'

// import React from 'react'
// import PropTypes from 'prop-types'
// import { View, Linking } from 'react-native'
// import { has } from 'lodash/fp'
// import { urlPrefix } from 'util/platform'
// import mixins from '../../style/mixins'
// import Loading from '../Loading'
// import LoginNavigator from '../LoginNavigator'
// import SocketListener from '../SocketListener'
// import RootNavigator from '../RootNavigator'

// jest.mock('react-navigation', () => {})
// jest.mock('../RootNavigator', () => 'RootNavigator')
// jest.mock('../LoginNavigator', () => 'LoginNavigator')
// jest.mock('react-native-aws3')
// jest.mock('react-native-onesignal', () => ({
//   getPermissionSubscriptionState: jest.fn(() => Promise.resolve({userId: 5}))
// }))
// jest.mock('react-native-google-signin')
// jest.mock('react-native-zss-rich-text-editor')

const requiredProps = {
  checkSession: () => {},
  initOneSignal: () => {},
  setEntryURL: () => {},
  resetEntryURL: () => {},
  fetchCurrentUser: () => {}
}

it('matches last snapshot loading', () => {
  const renderer = new ReactShallowRenderer()
  renderer.render(<SessionCheck {...requiredProps} />)
  const actual = renderer.getRenderOutput()

  expect(actual).toMatchSnapshot()
})

it('matches last snapshot not loggedIn', () => {
  const renderer = new ReactShallowRenderer()
  renderer.render(<SessionCheck {...requiredProps} loggedIn={false} />)
  const actual = renderer.getRenderOutput()

  expect(actual).toMatchSnapshot()
})

it('matches last snapshot loggedIn', () => {
  const renderer = new ReactShallowRenderer()
  renderer.render(<SessionCheck {...requiredProps} loggedIn />)
  const actual = renderer.getRenderOutput()

  expect(actual).toMatchSnapshot()
})

// From LoggedInRoot -- tests fetchCurrentUser and such
// import ReactShallowRenderer from 'react-test-renderer/shallow'
// import LoggedInRoot from './LoggedInRoot'
// import React from 'react'
//
// jest.mock('react-native-google-signin')
// jest.mock('react-native-zss-rich-text-editor')
// jest.mock('react-native-onesignal', () => ({
//   getPermissionSubscriptionState: jest.fn(() => Promise.resolve({userId: 5}))
// }))
//
// it('renders as expected', () => {
//   const renderer = new ReactShallowRenderer()
//   const fetchCurrentUser = jest.fn()
//   const registerDevice = jest.fn()
//   renderer.render(<LoggedInRoot {...{fetchCurrentUser, registerDevice}} />)
//   const actual = renderer.getRenderOutput()
//   expect(actual).toMatchSnapshot()
//
//   // TODO: call componentDidMount and check that the mock functions were called
// })
//

// From LoggedInRoot -- connector tests?
// import Component from './index'
// import React from 'react'
// import ReactShallowRenderer from 'react-test-renderer/shallow'
//
// jest.mock('react-native-google-signin')
// jest.mock('react-native-zss-rich-text-editor')
// jest.mock('react-native-onesignal', () => ({
//   getPermissionSubscriptionState: jest.fn(() => Promise.resolve({userId: 5}))
// }))
//
// it('renders as expected', () => {
//   const renderer = new ReactShallowRenderer()
//   const mockStore = {
//     subscribe: jest.fn(),
//     getState: jest.fn(),
//     dispatch: jest.fn()
//   }
//   renderer.render(<Component store={mockStore} />)
//   expect(renderer.getRenderOutput()).toMatchSnapshot()
// })
