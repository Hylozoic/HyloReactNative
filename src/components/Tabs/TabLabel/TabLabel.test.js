import 'react-native'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import TabLabel from './index'

it('renders correctly with all=true, and no community or user', () => {
  const renderer = new ReactShallowRenderer()
  const name = 'Home'
  const focused = false

  renderer.render(<TabLabel name={name} focused={focused} />)
  const actual = renderer.getRenderOutput()

  expect(actual).toMatchSnapshot()
})
