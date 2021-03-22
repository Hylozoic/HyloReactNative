import React from 'react'
import 'react-native'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import ReactTestRenderer from 'react-test-renderer'
import Control from './Control'

describe('Control', () => {
  it('matches the last snapshot', () => {
    const props = {
      value: 'a',
      placeholder: 'b',
      onChangeTest: () => {},
      editable: true,
      onBlur: () => {},
      multiline: true,
      hideEditIcon: false,
      isMe: true
    }

    const renderer = new ReactShallowRenderer()
    renderer.render(<Control {...props} />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })

  describe('focus', () => {
    it('calls input.focus', () => {
      const instance = ReactTestRenderer.create(<Control />).getInstance()
      instance.inputRef.current = {
        focus: jest.fn()
      }
      instance.focus()
      expect(instance.inputRef.current.focus).toHaveBeenCalled()
    })
  })
})
