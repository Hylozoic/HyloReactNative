import 'react-native'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import ReactTestRenderer from 'react-test-renderer'
import { HeaderButton } from './header'

jest.mock('util/platform', () => ({ isIOS: true }))

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
  it('sets state.disabled to match props', () => {
    const props = {
      ...defaultProps,
      disabled: true
    }
    const instance = ReactTestRenderer.create(<HeaderButton {...props} />).getInstance()
    expect(instance.state.disabled).toEqual(true)
  })

  describe('componentDidUpdate', () => {
    it('changes state.disabled when prop changes', () => {
      const instance = ReactTestRenderer.create(<HeaderButton {...defaultProps} />).getInstance()
      instance.setState({ disabled: true })
      instance.componentDidUpdate({ disabled: true })
      expect(instance.state.disabled).toEqual(false)
    })
  })

  describe('onPress', () => {
    it('sets state.disabled to true and calls props.onPress', () => {
      const props = {
        ...defaultProps,
        onPress: jest.fn()
      }
      const instance = ReactTestRenderer.create(<HeaderButton {...props} />).getInstance()
      instance.onPress()
      expect(instance.state.disabled).toEqual(true)
      expect(props.onPress).toHaveBeenCalled()
    })

    it('does not set state.disabled to true if disableOnClick is true and calls props.onPress', () => {
      const props = {
        ...defaultProps,
        onPress: jest.fn(),
        disableOnClick: false
      }
      const instance = ReactTestRenderer.create(<HeaderButton {...props} />).getInstance()
      instance.onPress()
      expect(instance.state.disabled).toEqual(false)
    })
  })
})
