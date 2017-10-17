import 'react-native'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import Signup from './Signup'

jest.mock('react-native-device-info')

it('matches last snapshot', () => {
  const renderer = new ReactShallowRenderer()

  renderer.render(<Signup
    goToSignupFlow={() => {}}
    goToLogin={() => {}} />)
  const actual = renderer.getRenderOutput()

  expect(actual).toMatchSnapshot()
})
