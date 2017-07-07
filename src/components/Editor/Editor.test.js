import Editor from './index'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'

it('renders as expected', () => {
  const renderer = new ReactShallowRenderer()
  renderer.render(<Editor />)
  expect(renderer.getRenderOutput()).toMatchSnapshot()
})
