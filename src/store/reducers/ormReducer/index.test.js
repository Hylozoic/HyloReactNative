import orm from 'store/models'
import ormReducer from './index'
import {
  SET_TOPIC_SUBSCRIBE_PENDING
} from 'screens/Feed/Feed.store'
import {
  VOTE_ON_POST_PENDING
} from 'components/PostCard/PostFooter/PostFooter.store'
import {
  UPDATE_THREAD_READ_TIME_PENDING
} from 'screens/Thread/Thread.store'
import {
  UPDATE_LAST_VIEWED_PENDING
} from 'screens/ThreadList/ThreadList.store'
import {
  UPDATE_NEW_NOTIFICATION_COUNT_PENDING
} from 'screens/NotificationsList/NotificationsList.store'
import {
  RESET_NEW_POST_COUNT_PENDING
} from 'store/actions/resetNewPostCount'
import {
  PIN_POST_PENDING
} from 'components/PostCard/PostHeader/PostHeader.store'
import {
  CREATE_GROUP
} from 'screens/CreateGroupFlow/CreateGroupFlow.store'
import {
  UPDATE_MEMBERSHIP_SETTINGS_PENDING, UPDATE_ALL_MEMBERSHIP_SETTINGS_PENDING
} from 'screens/NotificationSettings/NotificationSettings.store'
import {
  DELETE_COMMENT_PENDING,
  JOIN_PROJECT_PENDING,
  LEAVE_PROJECT_PENDING,
  FETCH_CURRENT_USER,
  UPDATE_USER_SETTINGS_PENDING,
  USE_INVITATION
} from 'store/constants'

it('responds to an action with meta.extractModel', () => {
  const state = orm.getEmptyState()

  const action = {
    type: 'whatever',
    payload: {
      data: {
        post: {
          id: '1',
          title: 'Cat on the loose',
          groups: [
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
    Group: {
      items: ['1'],
      itemsById: { 1: { id: '1', name: 'Neighborhood' } }
    },
    Person: {
      items: ['2'],
      itemsById: { 2: { id: '2', name: 'Greg' } }
    },
    Post: {
      items: ['1'],
      itemsById: { 1: { id: '1', title: 'Cat on the loose', creator: '2' } }
    },
    PostGroups: {
      items: [0],
      itemsById: { 0: { fromPostId: '1', toGroupId: '1', id: 0 } }
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

it('handles SET_TOPIC_SUBSCRIBE_PENDING', () => {
  const session = orm.session(orm.getEmptyState())
  session.GroupTopic.create({
    topic: '1', group: '1', isSubscribed: false, followersTotal: 3
  })
  const action = {
    type: SET_TOPIC_SUBSCRIBE_PENDING,
    meta: {
      topicId: '1',
      groupId: '1',
      isSubscribing: true
    }
  }

  const newState = ormReducer(session.state, action)
  const newSession = orm.session(newState)
  expect(newSession.GroupTopic.first().followersTotal).toBe(4)
  expect(newSession.GroupTopic.first().isSubscribed).toBeTruthy()
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
    const group1Id = 'group1Id'
    const group2Id = 'group2Id'
    const membership1Id = 'membership1Id'
    const membership2Id = 'membership2Id'

    session.Me.create({ id: meId })
    session.Group.create({ id: group1Id, name: 'group 1' })
    session.Group.create({ id: group2Id, name: 'group 2' })
    session.Membership.create({ id: membership1Id, group: group1Id, person: meId })
    session.Membership.create({ id: membership2Id, group: group2Id, person: meId }) // const me = session.Me.first()

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

describe('DELETE_COMMENT_PENDING', () => {
  let session

  beforeEach(() => {
    session = orm.session(orm.getEmptyState())
    const post = session.Post.create({ id: '1', commentsTotal: 2 })
    session.Comment.create({ id: '3', post })
    session.Comment.create({ id: '10', post })
  })

  it('optimistically deletes a comment', () => {
    const action = {
      type: DELETE_COMMENT_PENDING,
      meta: {
        id: '3'
      }
    }

    const newState = ormReducer(session.state, action)
    const newSession = orm.session(newState)
    expect(newSession.Comment.count()).toBe(1)
    expect(newSession.Comment.first().id).toBe('10')
  })

  it('decrements commentsTotal', () => {
    const action = {
      type: DELETE_COMMENT_PENDING,
      meta: {
        id: '3'
      }
    }
    const newState = ormReducer(session.state, action)
    const newSession = orm.session(newState)
    expect(newSession.Post.withId(1).commentsTotal).toBe(1)
  })
})

describe('on UPDATE_LAST_VIEWED_PENDING', () => {
  const session = orm.session(orm.getEmptyState())
  session.Me.create({
    id: '1',
    unseenThreadCount: 11
  })

  const action = {
    type: UPDATE_LAST_VIEWED_PENDING
  }

  it('sets Me.unseenThreadCount to 0', () => {
    const newSession = orm.session(ormReducer(session.state, action))
    expect(newSession.Me.first().unseenThreadCount).toEqual(0)
  })
})

describe('on UPDATE_NEW_NOTIFICATION_COUNT_PENDING', () => {
  const session = orm.session(orm.getEmptyState())
  session.Me.create({
    id: '1',
    newNotificationCount: 11
  })

  const action = {
    type: UPDATE_NEW_NOTIFICATION_COUNT_PENDING
  }

  it('sets Me.newNotificationCount to 0', () => {
    const newSession = orm.session(ormReducer(session.state, action))
    expect(newSession.Me.first().newNotificationCount).toEqual(0)
  })
})

describe('on RESET_NEW_POST_COUNT_PENDING', () => {
  const action = {
    type: RESET_NEW_POST_COUNT_PENDING,
    meta: {
      graphql: {
        variables: {
          id: 1
        }
      }
    }
  }

  const session = orm.session(orm.getEmptyState())
  session.Me.create({ id: 1 })
  session.Group.create({ id: 1, name: 'group 1' })
  session.Membership.create({ id: 1, group: 1, person: 1 })
  expect(session.Membership.first().newPostCount).toEqual(undefined)
  const newSession = orm.session(ormReducer(session.state, action))
  expect(newSession.Membership.first().newPostCount).toEqual(0)
})

// NOTE: Expecting this to break/be irrelevant
describe('on UPDATE_USER_SETTINGS_PENDING', () => {
  const session = orm.session(orm.getEmptyState())
  const id = 123
  const userData = {
    id,
    location: 'Spain',
    tagline: 'lalala',
    settings: {
      setting1: 1,
      setting2: 2
    }
  }
  session.Me.create(userData)

  session.Person.create(userData)

  const action = {
    type: UPDATE_USER_SETTINGS_PENDING,
    meta: {
      changes: {
        location: 'Japan',
        settings: {
          setting2: 3
        }
      }
    }
  }

  it('updates Me and the Person', () => {
    const newSession = orm.session(ormReducer(session.state, action))
    expect(newSession.Me.first().ref).toMatchSnapshot()
    expect(newSession.Person.withId(id).ref).toMatchSnapshot()
  })
})

describe('on FETCH_CURRENT_USER', () => {
  const session = orm.session(orm.getEmptyState())
  const id = 123
  const userData = {
    id,
    name: 'Maurice',
    location: 'Spain',
    tagline: 'lalala',
    avatarUrl: 'm.png',
    settings: {
      setting1: 1,
      setting2: 2
    }
  }
  session.Me.create(userData)

  session.Person.create(userData)

  const action = {
    type: FETCH_CURRENT_USER,
    payload: {
      data: {
        me: userData
      }
    }
  }

  it('creates the Person', () => {
    const newSession = orm.session(ormReducer(session.state, action))
    expect(newSession.Person.withId(id).ref).toMatchSnapshot()
  })
})

describe('on PIN_POST_PENDING', () => {
  const session = orm.session(orm.getEmptyState())
  const group = session.Group.create({ id: '1', slug: 'foo' })
  const postId = 123
  const postMembership = session.PostMembership.create({
    pinned: false,
    group: group
  })

  session.Post.create({
    id: postId,
    groups: [group],
    postMemberships: [postMembership]
  })

  const action = {
    type: PIN_POST_PENDING,
    meta: {
      postId,
      groupId: group.id
    }
  }

  it('updates the postMembership', () => {
    const newState = ormReducer(session.state, action)
    const newSession = orm.session(newState)

    const postMembership = newSession.Post.withId(postId).postMemberships.toModelArray()[0]
    expect(postMembership.pinned).toEqual(true)
  })
})

describe('on UPDATE_THREAD_READ_TIME_PENDING', () => {
  const session = orm.session(orm.getEmptyState())
  const id = 123

  session.MessageThread.create({
    id,
    lastReadAt: new Date(0)
  })

  const action = {
    type: UPDATE_THREAD_READ_TIME_PENDING,
    meta: {
      id
    }
  }

  it('updates the thread lastReadAt', () => {
    const newState = ormReducer(session.state, action)
    const newSession = orm.session(newState)

    const thread = newSession.MessageThread.withId(id)
    expect(new Date(thread.lastReadAt).getTime()).toBeGreaterThan(new Date().getTime() - 5000)
  })
})

describe('handles CREATE_GROUP', () => {
  it('should link the new Group to MeMemberships', () => {
    const session = orm.mutableSession(orm.getEmptyState())
    const meId = 'meId'
    const groupId = 'groupId'
    const membershipId = 'membershipId'
    session.Me.create({ id: meId })
    session.Group.create({ id: groupId, name: 'group 1' })
    session.Membership.create({ id: membershipId, group: groupId, person: meId })

    const action = {
      type: CREATE_GROUP,
      payload: {
        data: {
          createGroup: {
            id: groupId
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

describe('on UPDATE_MEMBERSHIP_SETTINGS_PENDING', () => {
  it('should update the membership settings', () => {
    const session = orm.mutableSession(orm.getEmptyState())
    const meId = 'meId'
    const groupId = 'groupId'
    const membershipId = 'membershipId'
    session.Me.create({ id: meId })
    session.Group.create({ id: groupId, name: 'group 1' })
    session.Membership.create({ id: membershipId, group: groupId, person: meId, settings: {} })

    const action = {
      type: UPDATE_MEMBERSHIP_SETTINGS_PENDING,
      meta: {
        settings: {
          sendEmail: true
        },
        groupId
      }
    }

    const newSession = orm.session(ormReducer(session.state, action))
    const membershipAfterAction = newSession.Membership.safeWithId(membershipId)
    expect(membershipAfterAction.settings.sendEmail).toEqual(true)
  })
})

describe('on UPDATE_ALL_MEMBERSHIP_SETTINGS_PENDING', () => {
  it('should update all the memberships settings', () => {
    const session = orm.mutableSession(orm.getEmptyState())
    const meId = 'meId'
    session.Me.create({ id: meId })
    session.Membership.create({ person: meId, settings: {} })
    session.Membership.create({ person: meId, settings: {} })
    session.Membership.create({ person: meId, settings: {} })

    const action = {
      type: UPDATE_ALL_MEMBERSHIP_SETTINGS_PENDING,
      meta: {
        settings: {
          sendEmail: true
        }
      }
    }

    const newSession = orm.session(ormReducer(session.state, action))
    const membershipsAfterAction = newSession.Membership.all().toModelArray()
    membershipsAfterAction.map(membership => {
      expect(membership.settings.sendEmail).toEqual(true)
    })
  })
})

describe('handles JOIN_PROJECT_PENDING', () => {
  it('should add project member', () => {
    const session = orm.mutableSession(orm.getEmptyState())
    const projectMemberId = 'projectMemberId'
    const postId = '10'
    session.Me.create({ id: projectMemberId })
    session.Post.create({
      id: postId,
      type: 'project'
    })
    expect(session.ProjectMember.all().count()).toEqual(0)
    const action = {
      type: JOIN_PROJECT_PENDING,
      meta: {
        id: postId
      }
    }
    const newSession = orm.session(ormReducer(session.state, action))
    expect(newSession.ProjectMember.all().count()).toEqual(1)
  })
})

describe('handles LEAVE_PROJECT_PENDING', () => {
  it('should remove project member', () => {
    const session = orm.mutableSession(orm.getEmptyState())
    const projectMemberId = 'projectMemberId'
    const postId = '10'
    session.Me.create({ id: projectMemberId })
    session.Post.create({
      id: postId,
      type: 'project'
    })
    session.ProjectMember.create({ post: postId, member: projectMemberId })
    expect(session.ProjectMember.all().count()).toEqual(1)
    const action = {
      type: LEAVE_PROJECT_PENDING,
      meta: {
        id: postId
      }
    }
    const newSession = orm.session(ormReducer(session.state, action))
    // const projectMembershipsAfterAction = newSession.ProjectMember.all().toRefArray()
    expect(newSession.ProjectMember.all().count()).toEqual(0)
  })
})
