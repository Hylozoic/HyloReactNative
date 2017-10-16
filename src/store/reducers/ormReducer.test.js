import orm from 'store/models'
import ormReducer from './ormReducer'
import {
  RECEIVE_MESSAGE
} from '../../components/SocketListener/SocketListener.store'
import {
  TOGGLE_TOPIC_SUBSCRIBE_PENDING
} from '../../components/Feed/Feed.store'
import {
  VOTE_ON_POST_PENDING
} from '../../components/PostCard/PostFooter/PostFooter.store'
import {
  CREATE_COMMENT
} from '../../components/PostDetails/CommentEditor/CommentEditor.store'

it('responds to an action with meta.extractModel', () => {
  const state = orm.getEmptyState()

  const action = {
    type: 'whatever',
    payload: {
      data: {
        post: {
          id: '1',
          title: 'Cat on the loose',
          communities: [
            {
              id: '1',
              name: 'Neighborhood'
            }
          ],
          creator: {
            id: '2',
            name: 'Greg'
          }
        }
      }
    },
    meta: {
      extractModel: 'Post'
    }
  }

  const newState = ormReducer(state, action)

  expect(newState).toMatchObject({
    Community: {
      items: ['1'],
      itemsById: {'1': {id: '1', name: 'Neighborhood'}}
    },
    Person: {
      items: ['2'],
      itemsById: {'2': {id: '2', name: 'Greg'}}
    },
    Post: {
      items: ['1'],
      itemsById: {'1': {id: '1', title: 'Cat on the loose', creator: '2'}}
    },
    PostCommunities: {
      items: [0],
      itemsById: {'0': {fromPostId: '1', toCommunityId: '1', id: 0}}
    }
  })
})

it('ignores an action with meta.extractModel that is a promise', () => {
  const state = orm.getEmptyState()

  const action = {
    type: 'FOO',
    payload: new Promise(() => {}),
    meta: {
      extractModel: 'Post'
    }
  }

  const newState = ormReducer(state, action)
  expect(newState).toEqual(state)
})

it('handles RECEIVE_MESSAGE', () => {
  const session = orm.session(orm.getEmptyState())
  session.MessageThread.create({
    id: '5'
  })

  const timestamp = new Date()

  const action = {
    type: RECEIVE_MESSAGE,
    payload: {
      data: {
        message: {
          messageThread: '5',
          text: 'hi',
          createdAt: timestamp
        }
      }
    }
  }

  const newState = ormReducer(session.state, action)
  const newSession = orm.session(newState)
  expect(newSession.MessageThread.withId('5').updatedAt).toEqual(timestamp)
})

it('handles CREATE_COMMENT', () => {
  const session = orm.session(orm.getEmptyState())
  session.Post.create({
    id: '10'
  })

  const action = {
    type: CREATE_COMMENT,
    meta: {
      postId: '10'
    }
  }

  const newState = ormReducer(session.state, action)
  const newSession = orm.session(newState)
  expect(newSession.Post.withId('10').commentsTotal).toEqual(1)
})

it('handles TOGGLE_TOPIC_SUBSCRIBE_PENDING', () => {
  const session = orm.session(orm.getEmptyState())
  session.CommunityTopic.create({
    topic: '1', community: '1', isSubscribed: false, followersTotal: 3
  })
  const action = {
    type: TOGGLE_TOPIC_SUBSCRIBE_PENDING,
    meta: {
      topicId: '1',
      communityId: '1',
      isSubscribing: true
    }
  }

  const newState = ormReducer(session.state, action)
  const newSession = orm.session(newState)
  expect(newSession.CommunityTopic.first().followersTotal).toBe(4)
  expect(newSession.CommunityTopic.first().isSubscribed).toBeTruthy()
})

describe('handles VOTE_ON_POST_PENDING', () => {
  it('up vote', () => {
    const session = orm.session(orm.getEmptyState())
    session.Post.create({
      id: '10',
      myVote: false
    })
    const upVoteAction = {
      type: VOTE_ON_POST_PENDING,
      meta: {
        postId: '10',
        isUpvote: true
      }
    }

    const newState = ormReducer(session.state, upVoteAction)
    const newSession = orm.session(newState)
    expect(newSession.Post.first().myVote).toBeTruthy()
  })

  it('down vote', () => {
    const session = orm.session(orm.getEmptyState())
    session.Post.create({
      id: '22',
      myVote: true
    })

    const downVoteAction = {
      type: VOTE_ON_POST_PENDING,
      meta: {
        postId: '22',
        isUpvote: false
      }
    }

    const newState = ormReducer(session.state, downVoteAction)
    const newSession = orm.session(newState)
    expect(newSession.Post.first().myVote).toBeFalsy()

  })
})
