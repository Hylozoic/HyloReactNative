import LoginNavigator from './index'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'

jest.mock('react-native-device-info')
jest.mock('react-native-onesignal')

it('has the expected shape', () => {
  const renderer = new ReactShallowRenderer()
  renderer.render(<LoginNavigator />)

  const output = renderer.getRenderOutput()
  // there's a little bit of randomness in the output that we have to mask
  output.props.navigation.state.routes[0].key = 'foo'
  expect(output).toMatchSnapshot()
})
