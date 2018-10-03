import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import TestRenderer from 'react-test-renderer'
import { Provider } from 'react-redux'
import PostDetails, { CommentPrompt, Files } from './ProjectMembers'
import { Linking, TouchableOpacity } from 'react-native'
import { createMockStore } from 'util/testing'
import orm from 'store/models'

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
  fetchPost: jest.fn(),
  showMember: jest.fn(),
  showTopic: jest.fn(),
  createComment: jest.fn(() => Promise.resolve({success: true})),
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

  it('handleCreateComment success', async () => {
    const renderer = TestRenderer.create(<Provider store={createMockStore(state)}><PostDetails {...props} /></Provider>)
    const instance = renderer.root.findByType(PostDetails).instance
    const commentText = 'some text [amention:0] #topic <some encoded stuff>'
    instance.setState({commentText})

    const promise = instance.handleCreateComment('some text [amention:3332] #topic <some encoded stuff>')
    expect(instance.state.submitting).toBeTruthy()
    expect(props.createComment).toHaveBeenCalledWith(`some text <a href="#" data-entity-type="mention" data-user-id="3332">amention</a> #topic &lt;some encoded stuff&gt;`)
    await promise
    expect(instance.state.submitting).toBeFalsy()
    expect(instance.state.commentText).toBe('')
  })

  it('handleCreateComment rejection', async () => {
    const rejectionProps = {
      ...props,
      createComment: jest.fn(() => Promise.resolve({error: new Error('blah')}))
    }

    const renderer = TestRenderer.create(<Provider store={createMockStore(state)}><PostDetails {...rejectionProps} /></Provider>)
    const instance = renderer.root.findByType(PostDetails).instance
    const commentText = 'some text [amention:0] #topic <some encoded stuff>'
    instance.setState({commentText})

    const promise = instance.handleCreateComment(commentText)
    expect(instance.state.submitting).toBeTruthy()
    await promise
    expect(instance.state.submitting).toBeFalsy()
    expect(instance.state.commentText).toBe(commentText)
  })

  it('handleCommentOnChange', () => {
    const renderer = TestRenderer.create(<Provider store={createMockStore(state)}><PostDetails {...props} /></Provider>)
    const instance = renderer.root.findByType(PostDetails).instance
    const commentText = 'some text [amention:0] #topic <some encoded stuff>'
    instance.setState({commentText})

    instance.handleCommentOnChange('something or nothing')
    expect(instance.state.commentText).toEqual('something or nothing')
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
