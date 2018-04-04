import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import TestRenderer from 'react-test-renderer'
import PostDetails, { CommentPrompt, Files } from './PostDetails'
import { Linking, TouchableOpacity } from 'react-native'

jest.mock('react-native-device-info')

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
  type: 'request',
  fileUrls: [
    'http://foo.com/foo.pdf',
    'http://foo.com/bar.zip'
  ],
  pinned: true,
  topics: [
    {name: 'topic1', id: 1}
  ]
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
      pending={false}
      showMember={() => {}}
      showTopic={() => {}}
      goToCommunity={() => {}} />)

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

describe('Files', () => {
  it('renders correctly', async () => {
    const renderer = TestRenderer.create(<Files urls={[
      'http://foo.com/foo.pdf',
      'http://foo.com/bar.zip'
    ]} />)
    expect(renderer).toMatchSnapshot()

    await renderer.root.findAllByType(TouchableOpacity)[0].props.onPress()
    expect(Linking.canOpenURL).toHaveBeenCalledWith('http://foo.com/foo.pdf')
    expect(Linking.openURL).toHaveBeenCalledWith('http://foo.com/foo.pdf')
  })
})
