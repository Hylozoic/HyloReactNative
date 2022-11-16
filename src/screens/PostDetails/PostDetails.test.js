import React from 'react'
import TestRenderer from 'react-test-renderer'
import PostDetails from './PostDetails'
import { TestRoot } from 'util/testing'
import MockedScreen from 'util/testing/MockedScreen'
import orm from 'store/models'

// TODO: Fix tests to have test Redux store for Redux hooks:
//       https://gist.github.com/krawaller/e5d40217658fa132f3c3904987e467cd

jest.mock('components/SocketSubscriber', () => () => null)
// jest.mock('components/HyloEditorWebview', () => () => null)
jest.mock('store/selectors/getCurrentGroupSlug', () => () => 'public')

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
  pending: false,
  fetchPost: jest.fn(),
  createComment: jest.fn(async () => ({ success: true })),
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

// From deprecated connector, the state construction here might still be useful
// for elaborating the above test:

// let state, props, stateProps, dispatchProps

// const session = orm.session(orm.getEmptyState())
// session.Group.create({ id: '2', name: 'Home' })
// session.Person.create({ id: '10' })
// session.Post.create({ id: '1', groups: ['2'], creator: '10' })
// session.Attachment.create({
//   id: '1',
//   post: '1',
//   type: 'file',
//   url: 'http://foo.com/foo.pdf'
// })
// session.Attachment.create({
//   id: '2',
//   post: '1',
//   type: 'image',
//   url: 'http://foo.com/bar.png'
// })

// state = {
//   orm: session.state,
//   CommentEditor: {
//     1: 'draft comment text'
//   }
// }

// props = {
//   isFocused: true,
//   route: {
//     params: { id: '1' }
//   },
//   navigation: {
//     navigate: (...args) => (['navigate', args])
//   }
// }

// stateProps = {
//   id: 'testpost',
//   post: { id: 'testpost' },
//   currentUser: { id: 'currentuser' }
// }

// dispatchProps = {
//   dispatch: jest.fn((...args) => ['dispatch', args])
// }
