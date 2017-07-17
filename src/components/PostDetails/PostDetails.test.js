import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import PostDetails, { CommentPrompt } from './PostDetails'

const post = {
  id: '91',
  creator: {
    id: '77',
    name: 'Houdini'
  },
  communities: [{slug: 'foom'}],
  createdAt: '2017-05-19T23:24:58Z',
  imageUrl: 'foom.png',
  title: 'Hi',
  details: 'Lo',
  linkPreview: {
    id: '34'
  },
  commenters: [{id: 9}, {id: 7}],
  commentsTotal: 12,
  votesTotal: 8,
  myVote: true,
  type: 'request'
}
const currentUser = {
  id: 123,
  avatarUrl: 'me.png',
  firstName: () => 'Joe'
}

describe('PostDetails', () => {
  it('renders correctly', () => {
    const renderer = new ReactShallowRenderer()
    renderer.render(<PostDetails
      post={post}
      currentUser={currentUser}
      editPost={() => {}}
      pending
      showMember={() => {}}
      showTopic={() => {}} />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })
})

describe('CommentPrompt', () => {
  it('renders correctly', () => {
    const renderer = new ReactShallowRenderer()
    renderer.render(<CommentPrompt
      currentUser={currentUser}
      newComment={() => {}} />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })

  it('renders with comment text', () => {
    const renderer = new ReactShallowRenderer()
    renderer.render(<CommentPrompt
      currentUser={currentUser}
      newComment={() => {}}
      commentEdit='A long enough comment that it will be truncated' />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })
})
