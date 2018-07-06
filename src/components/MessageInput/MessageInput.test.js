import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import ReactTestRenderer from 'react-test-renderer'
import MessageInput from './MessageInput'

it('matches the last snapshot', () => {
  const shallow = new ReactShallowRenderer()
  shallow.render(<MessageInput onSubmit={() => {}} placeholder='Wombats...' />)
  expect(shallow.getRenderOutput()).toMatchSnapshot()
})

describe('handleChange', () => {
  it('calls startTyping, onChange and setMessage', () => {
    const props = {
      setMessage: jest.fn()
    }
    const instance = ReactTestRenderer.create(<MessageInput {...props} />).getInstance()
    instance.startTyping = jest.fn()
    const text = 'hi there'
    instance.handleChange(text)
    expect(instance.startTyping).toHaveBeenCalled()
    expect(instance.state.submittable).toEqual(true)
    expect(props.setMessage).toHaveBeenCalledWith(text)
  })
})
