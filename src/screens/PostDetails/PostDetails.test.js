import React from 'react'
import TestRenderer from 'react-test-renderer'
import { PostDetails } from './PostDetails'
import { TestRoot } from 'util/testing'
import MockedScreen from 'util/testing/MockedScreen'
import orm from 'store/models'

// TODO: Fix tests to have test Redux store for Redux hooks:
//       https://gist.github.com/krawaller/e5d40217658fa132f3c3904987e467cd

jest.mock('components/SocketSubscriber', () => () => null)
jest.mock('store/selectors/getCurrentGroupId', () => () => 'public')

const post = {
  id: '91',
  creator: {
    id: '77',
    name: 'Houdini'
  },
  groups: [{ slug: 'foom' }],
  createdAt: '2017-05-19T23:24:58Z',
  imageUrls: ['foom.png'],
  title: 'Hi',
  details: 'Lo',
  commenters: [{ id: 9, name: 'Jebobo Crustacean' }, { id: 7, name: 'Lobster Science' }],
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
    { name: 'topic1', id: '1' }
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
  createComment: jest.fn(async () => ({ success: true })),
  goToGroup: jest.fn(),
  navigation: {
    setOptions: jest.fn(),
    setParams: jest.fn(),
    getParam: jest.fn()
  }
}

const state = {
  orm: orm.getEmptyState(),
  queryResults: {},
  pending: {},
  session: {}
}

// TODO: Needs a little work since significant refactor of most of this component into `CommentEditor`
describe('PostDetails', () => {
  it('renders correctly', () => {
    const renderer = TestRenderer.create(
      <TestRoot state={state}>
        <MockedScreen>
          {() => <PostDetails {...props} />}
        </MockedScreen>
      </TestRoot>
    )
    expect(renderer.toJSON()).toMatchSnapshot()
  })
})
