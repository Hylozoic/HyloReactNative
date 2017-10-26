import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import MessagesIcon from './MessagesIcon'

describe('MessagesIcon', () => {
  it('renders correctly', () => {
    const renderer = new ReactShallowRenderer()
    const showMessages = jest.fn()
    renderer.render(<MessagesIcon showMessages={showMessages} />)
    const actual = renderer.getRenderOutput()
    expect(actual.props.onPress).toBe(showMessages)
    expect(actual).toMatchSnapshot()
  })
})
