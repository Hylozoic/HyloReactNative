import orm from 'store/models'
import ormReducer from './ormReducer'
import {
  TOGGLE_TOPIC_SUBSCRIBE_PENDING
} from '../../components/Feed/Feed.store'
import {
  VOTE_ON_POST_PENDING
} from '../../components/PostCard/PostFooter/PostFooter.store'
import {
  CREATE_COMMENT
} from '../../components/PostDetails/CommentEditor/CommentEditor.store'
import {
  USE_INVITATION
} from '../../components/JoinCommunity/JoinCommunity.store'
import {
  DELETE_COMMENT_PENDING
} from '../../components/Comment/Comment.store'

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

describe('handles USE_INVITATION', () => {
  it('should link the new Membership to MeMemberships', () => {
    const session = orm.mutableSession(orm.getEmptyState())
    const meId = 'meId'
    const community1Id = 'community1Id'
    const community2Id = 'community2Id'
    const membership1Id = 'membership1Id'
    const membership2Id = 'membership2Id'

    session.Me.create({id: meId})
    session.Community.create({id: community1Id, name: 'community 1'})
    session.Community.create({id: community2Id, name: 'community 2'})
    session.Membership.create({id: membership1Id, community: community1Id, person: meId})
    session.Membership.create({id: membership2Id, community: community2Id, person: meId})    // const me = session.Me.first()

    const action = {
      type: USE_INVITATION,
      payload: {
        data: {
          useInvitation: {
            membership: {
              id: membership1Id
            }
          }
        }
      }
    }
    const memberships = session.Me.first().memberships
    expect(memberships.count()).toEqual(0)
    const newSession = orm.session(ormReducer(session.state, action))
    const membershipsAfterAction = newSession.Me.first().memberships
    expect(membershipsAfterAction.count()).toEqual(1)
  })
})

it('handles DELETE_COMMENT_PENDING', () => {
  const session = orm.session(orm.getEmptyState())
  session.Comment.create({
    id: 3
  })
  session.Comment.create({
    id: 10
  })
  const action = {
    type: DELETE_COMMENT_PENDING,
    meta: {
      id: '3'
    }
  }

  expect(session.Comment.count()).toBe(2)
  const newState = ormReducer(session.state, action)
  const newSession = orm.session(newState)
  expect(newSession.Comment.count()).toBe(1)
  expect(newSession.Comment.first().id).toBe(10)
})
