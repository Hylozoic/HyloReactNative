import 'react-native'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import Members from './Members'

it('renders correctly with all=true, and no community', () => {
  const renderer = new ReactShallowRenderer()
  renderer.render(<Members />)
  const actual = renderer.getRenderOutput()

  expect(actual).toMatchSnapshot()
})
