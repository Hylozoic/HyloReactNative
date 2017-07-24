import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import Messages from './index'

it('renders correctly', () => {
  const renderer = new ReactShallowRenderer()
  renderer.render(<Messages />)
  const actual = renderer.getRenderOutput()

  expect(actual).toMatchSnapshot()
})
