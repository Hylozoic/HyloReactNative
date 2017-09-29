import 'react-native'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import SessionCheck from './component'

jest.mock('react-native-onesignal', () => {})
jest.mock('react-native-google-signin')
jest.mock('react-native-zss-rich-text-editor')
jest.mock('react-navigation', () => {})
jest.mock('../RootNavigator', () => 'RootNavigator')
jest.mock('../LoginNavigator', () => 'LoginNavigator')
jest.mock('react-native-aws3', () => {})

const actions = {
  checkSession: () => {}
}

it('matches last snapshot loading', () => {
  const renderer = new ReactShallowRenderer()
  renderer.render(<SessionCheck actions={actions} />)
  const actual = renderer.getRenderOutput()

  expect(actual).toMatchSnapshot()
})

it('matches last snapshot not loggedIn', () => {
  const renderer = new ReactShallowRenderer()
  renderer.render(<SessionCheck loggedIn={false} actions={actions} />)
  const actual = renderer.getRenderOutput()

  expect(actual).toMatchSnapshot()
})

it('matches last snapshot loggedIn', () => {
  const renderer = new ReactShallowRenderer()
  renderer.render(<SessionCheck loggedIn actions={actions} />)
  const actual = renderer.getRenderOutput()

  expect(actual).toMatchSnapshot()
})
