import 'react-native'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import Topics from './index'

it('renders correctly with all=true, and no community or user', () => {
  const renderer = new ReactShallowRenderer()
  renderer.render(<Topics />)
  const actual = renderer.getRenderOutput()

  expect(actual).toMatchSnapshot()
})
