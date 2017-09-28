import 'react-native'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import SignupFlow3 from './SignupFlow3'

jest.mock('../../KeyboardFriendlyView', () => 'KeyboardFriendlyView')

it('matches last snapshot', () => {
  const renderer = new ReactShallowRenderer()
  const props = {
    location: 'Hull',
    saveAndNext: () => {},
    changeSetting: () => {}
  }

  renderer.render(<SignupFlow3 {...props} />)
  const actual = renderer.getRenderOutput()

  expect(actual).toMatchSnapshot()
})
