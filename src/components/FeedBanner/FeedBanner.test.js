import 'react-native'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import FeedBanner, { PostPrompt } from './FeedBanner'

const community = {
  id: '1',
  bannerUrl: 'community.png'
}
const currentUser = {
  id: '2',
  avatarUrl: 'user.png',
  name: 'John Wayne',
  firstName: () => 'John'
}
const newPost = () => {}

describe('FeedBanner', () => {
  it('renders correctly with all=true, and no community or user', () => {
    const renderer = new ReactShallowRenderer()
    renderer.render(<FeedBanner
      all
      newPost={newPost} />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })

  it('renders correctly with a community and user', () => {
    const renderer = new ReactShallowRenderer()
    renderer.render(<FeedBanner
      community={community}
      currentUser={currentUser}
      newPost={newPost} />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })
})

describe('PostPrompt', () => {
  it('renders null with no user', () => {
    const renderer = new ReactShallowRenderer()
    renderer.render(<PostPrompt
      newPost={newPost} />)
    const actual = renderer.getRenderOutput()

    expect(actual).toEqual(null)
  })

  it('renders correctly with a user', () => {
    const renderer = new ReactShallowRenderer()
    renderer.render(<PostPrompt
      currentUser={currentUser}
      newPost={newPost} />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })
})
