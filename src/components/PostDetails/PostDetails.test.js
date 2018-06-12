import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import TestRenderer from 'react-test-renderer'
import { Provider } from 'react-redux'
import PostDetails, { CommentPrompt, Files } from './PostDetails'
import { Linking, TouchableOpacity } from 'react-native'
import { createMockStore } from 'util/testing'
import orm from 'store/models'

jest.mock('react-native-device-info')

const post = {
  id: '91',
  creator: {
    id: '77',
    name: 'Houdini'
  },
  communities: [{slug: 'foom'}],
  createdAt: '2017-05-19T23:24:58Z',
  imageUrls: ['foom.png'],
  title: 'Hi',
  details: 'Lo',
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

const props = {
  post,
  currentUser,
  editPost: jest.fn(),
  pending: false,
  showMember: jest.fn(),
  showTopic: jest.fn(),
  createComment: jest.fn(),
  goToCommunity: jest.fn()
}

const state = {
  orm: orm.getEmptyState(),
  queryResults: {},
  pending: {}
}

describe('PostDetails', () => {
  it('renders correctly', () => {
    const renderer = new ReactShallowRenderer()
    renderer.render(<PostDetails {...props} />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })

  it('handleCreateComment', () => {
    //const instance = TestRenderer.create(<Provider store={createMockStore(state)}><PostDetails {...props} /></Provider>).getInstance()
    //instance.handleCreateComment('some text [amention:3332] #topic <some encoded stuff>')
    //expect(instance.state.submitting).toBeTruthy()
  })
})

describe('CommentPrompt', () => {
  it('renders correctly', () => {
    const renderer = new ReactShallowRenderer()
    renderer.render(<CommentPrompt
      currentUser={currentUser} />)
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
