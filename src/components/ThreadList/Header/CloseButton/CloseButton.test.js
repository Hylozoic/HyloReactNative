import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import CloseButton from './index'

const renderer = new ReactShallowRenderer()
const closeMessages = jest.fn()
renderer.render(<CloseButton closeMessages={closeMessages} />)
const actual = renderer.getRenderOutput()

it('CloseButton renders correctly', () => {
  expect(actual).toMatchSnapshot()
})

it('CloseButton calls closeMessage correctly', () => {
  expect(actual.props.onPress).toBe(closeMessages)
})
