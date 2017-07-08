import 'react-native'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import MemberProfile from './MemberProfile'

it('matches the last snapshot', () => {

  const renderer = new ReactShallowRenderer()
  renderer.render(<MemberProfile id={1} />)
  const actual = renderer.getRenderOutput()

  expect(actual).toMatchSnapshot()
})
