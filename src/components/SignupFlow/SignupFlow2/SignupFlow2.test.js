import 'react-native'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import SignupFlow2 from './SignupFlow2'

jest.mock('react-native-aws3', () => {})

it('matches last snapshot', () => {
  const renderer = new ReactShallowRenderer()
  const props = {
    avatarUrl: 'foo.png',
    saveAndNext: () => {},
    changeSetting: () => {}
  }

  renderer.render(<SignupFlow2 {...props} />)
  const actual = renderer.getRenderOutput()

  expect(actual).toMatchSnapshot()
})
