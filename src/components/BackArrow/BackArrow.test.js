import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import BackArrow from './BackArrow'

jest.mock('react-native-device-info')

describe('BackArrow', () => {
  it('renders correctly', () => {
    const renderer = new ReactShallowRenderer()
    renderer.render(<BackArrow
      navigation={jest.fn()}
    />)
    const actual = renderer.getRenderOutput()
    expect(actual).toMatchSnapshot()
  })
})
