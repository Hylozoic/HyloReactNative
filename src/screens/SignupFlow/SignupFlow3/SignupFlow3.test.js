import 'react-native'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import ReactTestRenderer from 'react-test-renderer'

import SignupFlow3 from './SignupFlow3'

jest.mock('components/KeyboardFriendlyView', () => 'KeyboardFriendlyView')

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

describe('saveAndNext', () => {
  it('blurs control and calls prop', () => {
    const props = {
      changeSetting: () => {},
      saveAndNext: jest.fn()
    }
    const instance = ReactTestRenderer.create(<SignupFlow3 {...props} />).root.instance
    instance.control.blur = jest.fn()
    instance.saveAndNext()
    expect(props.saveAndNext).toHaveBeenCalled()
    expect(instance.control.blur).toHaveBeenCalled()
  })
})
