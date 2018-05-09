import 'react-native'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import ReactTestRenderer from 'react-test-renderer'
import { HeaderButton } from './header'

jest.mock('util/platform', () => ({isIOS: true}))

describe('HeaderButton', () => {
  const defaultProps = {
    text: 'Press Me!',
    onPress: () => {},
    disabled: false
  }

  it('matches last snapshot', () => {
    const renderer = new ReactShallowRenderer()

    renderer.render(<HeaderButton {...defaultProps} />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })

  it('matches last Close icon snapshot', () => {
    const renderer = new ReactShallowRenderer()
    const closeProps = {
      ...defaultProps,
      text: 'Close'
    }
    renderer.render(<HeaderButton {...closeProps} />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })
})
