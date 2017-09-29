import 'react-native'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import LoginNavigator from './index'

jest.mock('react-native-google-signin', () => {})
jest.mock('react-native-zss-rich-text-editor', () => {})
jest.mock('react-native-aws3', () => {})
jest.mock('react-navigation', () => ({
  StackNavigator: () => 'StackNavigator'
}))

it('matches snapshot', () => {
  expect(<LoginNavigator />).toMatchSnapshot()
})
