import 'react-native'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import ReactTestRenderer from 'react-test-renderer'
import CreateCommunityUrl from './CreateCommunityUrl'

jest.mock('../../KeyboardFriendlyView', () => 'KeyboardFriendlyView')
jest.mock('react-native-device-info')

it('matches last snapshot', () => {
  const renderer = new ReactShallowRenderer()

  renderer.render(<CreateCommunityUrl />)
  const actual = renderer.getRenderOutput()
  expect(actual).toMatchSnapshot()
})

it('matches last snapshot when visible is true', () => {
  const renderer = ReactTestRenderer.create(<CreateCommunityUrl />)
  const instance = renderer.getInstance()
  instance.setState({error: 'This is an error'})
  expect(renderer.toJSON()).toMatchSnapshot()
})
