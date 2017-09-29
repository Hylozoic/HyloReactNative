import 'react-native'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import PostHeader from './PostHeader'

it('renders correctly with all=true, and no community or user', () => {
  const creator = {
    id: 24,
    name: 'Zeus',
    tagline: 'Go!',
    avatarUrl: 'foo.png'
  }
  const renderer = new ReactShallowRenderer()
  renderer.render(<PostHeader creator={creator}
    deletePost={() => {}}
    postId={22}
    canFlag={true}
    editPost={() => {}} date={new Date(new Date().getTime() - 60000 * 10)} />)
  const actual = renderer.getRenderOutput()

  expect(actual).toMatchSnapshot()
})

it('renders correctly when showCommunity is true', () => {
  const creator = {
    name: 'Zeus',
    tagline: 'Go!',
    avatarUrl: 'foo.png'
  }
  const communities = [
    {
      id: 1,
      name: 'Olympus'
    }
  ]
  const renderer = new ReactShallowRenderer()
  renderer.render(<PostHeader
    creator={creator}
    communities={communities}
    showCommunity
    postId={20}
    slug='olympus'
    canFlag={true}
    deletePost={() => {}}
    editPost={() => {}}
    date={new Date(new Date().getTime() - 60000 * 10)} />)
  const actual = renderer.getRenderOutput()

  expect(actual).toMatchSnapshot()
})

it('renders correctly with no flagging', () => {
  const creator = {
    name: 'Zeus',
    tagline: 'Go!',
    avatarUrl: 'foo.png'
  }
  const communities = [
    {
      id: 1,
      name: 'Olympus'
    }
  ]
  const renderer = new ReactShallowRenderer()
  renderer.render(<PostHeader
  creator={creator}
  communities={communities}
  showCommunity
  postId={20}
  slug='olympus'
  canFlag={false}
  deletePost={() => {}}
  editPost={() => {}}
  date={new Date(new Date().getTime() - 60000 * 10)} />)
  const actual = renderer.getRenderOutput()

  expect(actual).toMatchSnapshot()
})

