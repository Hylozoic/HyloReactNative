import 'react-native'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import { Home } from './Home'

jest.mock('react-native-device-info')

it('shows Loading with no community or user', () => {
  const renderer = new ReactShallowRenderer()
  renderer.render(<Home />)
  const actual = renderer.getRenderOutput()

  expect(actual).toMatchSnapshot()
})

it('shows Feed with a community and user', () => {
  const renderer = new ReactShallowRenderer()
  renderer.render(<Home currentUser={{}} communityId='1' />)
  const actual = renderer.getRenderOutput()

  expect(actual).toMatchSnapshot()
})
