import 'react-native'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import RootNavigator from './index'

jest.mock('react-native-google-signin', () => {})
jest.mock('react-native-zss-rich-text-editor', () => {})
jest.mock('react-navigation', () => ({
  TabNavigator: () => ({
    router: {}
  }),
  StackNavigator: () => {},
  DrawerNavigator: () => {}
}))

it('matches snapshot', () => {
  const renderer = new ReactShallowRenderer()

  renderer.render(<RootNavigator uriPrefix={'lala'} />)
  const actual = renderer.getRenderOutput()

  expect(actual).toMatchSnapshot()
})
