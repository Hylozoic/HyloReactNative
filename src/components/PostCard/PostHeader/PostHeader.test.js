import 'react-native'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import PostHeader from './PostHeader'

it('renders correctly with all=true, and no community or user', () => {
  const creator = {
    name: 'Zeus',
    tagline: 'Go!',
    avatarUrl: 'foo.png'
  }
  const renderer = new ReactShallowRenderer()
  renderer.render(<PostHeader creator={creator} deletePost={() => {}}
    editPost={() => {}} date={new Date(new Date().getTime() - 60000 * 10)} />)
  const actual = renderer.getRenderOutput()

  expect(actual).toMatchSnapshot()
})
