import 'react-native'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import TabIcon from './index'

jest.mock('util/platform', () => ({isIOS: true}))

it('renders correctly with all=true, and no community or user', () => {
  const renderer = new ReactShallowRenderer()
  const name = 'Home'
  const focused = false

  renderer.render(<TabIcon name={name} focused={focused} />)
  const actual = renderer.getRenderOutput()

  expect(actual).toMatchSnapshot()
})
