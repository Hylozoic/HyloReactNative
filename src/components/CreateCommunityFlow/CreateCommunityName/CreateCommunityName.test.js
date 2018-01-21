import 'react-native'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import ReactTestRenderer from 'react-test-renderer'
import CreateCommunityName from './CreateCommunityName'

jest.mock('../../KeyboardFriendlyView', () => 'KeyboardFriendlyView')
jest.mock('react-native-device-info')

it('matches last snapshot', () => {
  const renderer = new ReactShallowRenderer()
  renderer.render(<CreateCommunityName />)
  const actual = renderer.getRenderOutput()
  expect(actual).toMatchSnapshot()
})
