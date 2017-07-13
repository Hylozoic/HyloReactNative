import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import CloseButton from './index'

describe('MessagesIcon', () => {
  it('renders correctly', () => {
    const renderer = new ReactShallowRenderer()
    const closeMessages = jest.fn()
    renderer.render(<CloseButton closeMessages={closeMessages} />)
    const actual = renderer.getRenderOutput()
    expect(actual.props.onPress).toBe(closeMessages)
    expect(actual).toMatchSnapshot()
  })
})
