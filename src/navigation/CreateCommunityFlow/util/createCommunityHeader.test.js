import 'react-native'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import createCommunityHeader from './createCommunityHeader'

it('matches last snapshot', () => {
  const title = 'header title'
  const navigation = jest.fn()
  expect(createCommunityHeader(title, navigation)).toMatchSnapshot()
})
