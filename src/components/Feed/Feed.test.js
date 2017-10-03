import 'react-native'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import Feed from './Feed'

it('renders correctly', () => {
  const community = {
    id: '1'
  }
  const currentUser = {
    id: '2'
  }
  const newPost = () => {}

  const renderer = new ReactShallowRenderer()
  renderer.render(<Feed
    community={community}
    currentUser={currentUser}
    newPost={newPost}
    showPost={() => {}}
    editPost={() => {}}
    goToCommunity={() => {}}
    topicName={'amazing'} />)
  const actual = renderer.getRenderOutput()

  expect(actual).toMatchSnapshot()
})
