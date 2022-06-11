import * as sessionReducers from './sessionReducers'
import { values, pick, find } from 'lodash/fp'
import orm from 'store/models'
import ModelExtractor from '../ModelExtractor'
import extractModelsFromAction from '../ModelExtractor/extractModelsFromAction'
import clearCacheFor from './clearCacheFor'
import { isPromise } from 'util/index'
import {
  ADD_SKILL, REMOVE_SKILL
} from 'components/SkillEditor/SkillEditor.store'
import {
  SET_TOPIC_SUBSCRIBE_PENDING
} from 'screens/Feed/Feed.store'
import {
  MARK_ACTIVITY_READ, MARK_ALL_ACTIVITIES_READ, UPDATE_NEW_NOTIFICATION_COUNT_PENDING
} from 'screens/NotificationsList/NotificationsList.store'
import {
  CREATE_MESSAGE, CREATE_MESSAGE_PENDING, UPDATE_THREAD_READ_TIME_PENDING
} from 'screens/Thread/Thread.store'
import {
  VOTE_ON_POST_PENDING
} from 'components/PostCard/PostFooter/PostFooter.store'
import {
  UPDATE_LAST_VIEWED_PENDING
} from 'screens/ThreadList/ThreadList.store'
import {
  CREATE_GROUP
} from 'screens/CreateGroupFlow/CreateGroupFlow.store'
import {
  UPDATE_MEMBERSHIP_SETTINGS_PENDING, UPDATE_ALL_MEMBERSHIP_SETTINGS_PENDING
} from 'screens/NotificationSettings/NotificationSettings.store'
import {
  RESET_NEW_POST_COUNT_PENDING
} from 'store/actions/resetNewPostCount'
import {
  CANCEL_JOIN_REQUEST,
  CREATE_COMMENT_PENDING,
  CREATE_COMMENT,
  CREATE_JOIN_REQUEST,
  DELETE_COMMENT_PENDING,
  DELETE_GROUP_RELATIONSHIP,
  FETCH_CURRENT_USER,
  JOIN_PROJECT_PENDING,
  LEAVE_GROUP,
  LEAVE_PROJECT_PENDING,
  RESPOND_TO_EVENT_PENDING,
  UPDATE_COMMENT_PENDING,
  UPDATE_GROUP_SETTINGS_PENDING,
  USE_INVITATION
} from 'store/constants'
import { PIN_POST_PENDING } from 'components/PostCard/PostHeader/PostHeader.store'

export default function ormReducer (state = orm.getEmptyState().state, action) {
  const { payload, type, meta, error } = action

  if (error) return state

  const session = orm.session(state)
  const {
    Activity,
    Comment,
    Group,
    GroupRelationship,
    GroupTopic,
    JoinRequest,
    Me,
    Membership,
    Message,
    MessageThread,
    Person,
    Post,
    PostCommenter,
    ProjectMember,
    Skill
  } = session

  if (payload && !isPromise(payload) && meta && meta.extractModel) {
    extractModelsFromAction(action, session)
  }

  switch (type) {
    case CREATE_COMMENT_PENDING: {
      Comment.create({
        id: meta.tempId,
        post: meta.postId,
        text: meta.text,
        creator: Me.first().id
      })
      break
    }

    case CREATE_COMMENT: {
      Comment.withId(meta.tempId).delete()
      if (!PostCommenter.safeGet({ post: meta.postId, commenter: Me.first().id })) {
        PostCommenter.create({ post: meta.postId, commenter: Me.first().id })
        // we can assume the following because the backend returns the results pre-sorted
        // with the currentUser at the beginning
        const p = Post.withId(meta.postId)
        p.update({ commentersTotal: p.commentersTotal + 1 })
      }
      break
    }

    case CREATE_MESSAGE_PENDING: {
      Message.create({
        id: meta.tempId,
        messageThread: meta.messageThreadId,
        text: meta.text,
        createdAt: new Date().toString(),
        creator: Me.first().id
      })
      break
    }

    case CREATE_MESSAGE: {
      // remove the temporary message and then create the real one -- we do this
      // here instead of using meta.extractModel so it all happens in a single
      // reduce. we can't just update the temporary message because redux-orm
      // doesn't support updating ID's
      Message.withId(meta.tempId).delete()
      ModelExtractor.addAll({
        session,
        root: payload.getData(),
        modelName: 'Message'
      })
      break
    }

    case LEAVE_GROUP: {
      const me = Me.first()
      let membership = find(m => m.group.id === meta.id, me.memberships.toModelArray())

      if (membership) membership.delete()

      membership = Membership.safeGet({ group: meta.id, person: me.id })

      if (membership) membership.delete()
      break
    }

    case MARK_ACTIVITY_READ: {
      if (Activity.idExists(meta.id)) {
        Activity.withId(meta.id).update({ unread: false })
      }
      break
    }

    case MARK_ALL_ACTIVITIES_READ: {
      Activity.all().update({ unread: false })
      break
    }

    case ADD_SKILL: {
      const me = Me.first()
      const skill = Skill.create(payload.getData())
      me.updateAppending({ skills: [skill] })
      break
    }

    case REMOVE_SKILL: {
      const me = Me.first()
      const skill = Skill.safeGet({ name: meta.name })
      if (skill) {
        me.skills.remove(skill.id)
      }
      break
    }

    case VOTE_ON_POST_PENDING: {
      const post = Post.withId(meta.postId)
      if (post.myVote) {
        !meta.isUpvote && post.update({ myVote: false, votesTotal: (post.votesTotal || 1) - 1 })
      } else {
        meta.isUpvote && post.update({ myVote: true, votesTotal: (post.votesTotal || 0) + 1 })
      }
      break
    }

    case RESPOND_TO_EVENT_PENDING: {
      const event = Post.withId(meta.id)
      event.update({ myEventResponse: meta.response })
      break
    }

    case UPDATE_GROUP_SETTINGS_PENDING: {
      const group = Group.withId(meta.id)
      group.update(meta.changes)
      Membership.safeGet({ group: meta.id }).update({ forceUpdate: new Date() })
      break
    }

    case SET_TOPIC_SUBSCRIBE_PENDING: {
      const groupTopic = GroupTopic.get({
        topic: meta.topicId, group: meta.groupId
      })
      groupTopic.update({
        followersTotal: groupTopic.followersTotal + (meta.isSubscribing ? 1 : -1),
        isSubscribed: !!meta.isSubscribing
      })
      break
    }

    case USE_INVITATION: {
      const me = Me.first()
      me.updateAppending({ memberships: [payload.getData().membership.id] })
      break
    }

    case DELETE_COMMENT_PENDING: {
      const comment = Comment.withId(meta.id)
      const post = comment.post
      post.update({ commentsTotal: post.commentsTotal - 1 })
      comment.delete()
      break
    }

    case DELETE_GROUP_RELATIONSHIP: {
      if (payload.getData().success) {
        const gr = GroupRelationship.safeGet({ parentGroup: meta.parentId, childGroup: meta.childId })
        if (gr) {
          gr.delete()
          clearCacheFor(Group, meta.parentId)
          clearCacheFor(Group, meta.childId)
        }
      }
      break
    }

    case UPDATE_COMMENT_PENDING: {
      const comment = Comment.withId(meta.id)
      comment.update(meta.data)
      break
    }

    case UPDATE_LAST_VIEWED_PENDING: {
      const me = Me.first()
      me.update({ unseenThreadCount: 0 })
      break
    }

    case UPDATE_NEW_NOTIFICATION_COUNT_PENDING: {
      const me = Me.first()
      me.update({ newNotificationCount: 0 })
      break
    }

    case RESET_NEW_POST_COUNT_PENDING: {
      const { id } = meta.graphql.variables
      const membership = Membership.safeGet({ group: id })
      if (!membership) break
      membership.update({ newPostCount: 0 })
      break
    }

    case PIN_POST_PENDING: {
      const post = Post.withId(meta.postId)
      // this line is to clear the selector memoization
      post.update({ _invalidate: (post._invalidate || 0) + 1 })
      const postMembership = post.postMemberships.filter(p =>
        Number(p.group) === Number(meta.groupId)).toModelArray()[0]
      postMembership && postMembership.update({ pinned: !postMembership.pinned })
      break
    }

    case FETCH_CURRENT_USER: {
      const personId = payload.getData()?.id
      const attrs = pick(['id', 'avatarUrl', 'name', 'location'], payload.data.me)
      const person = Person.safeWithId(personId)
      person
        ? person.update(attrs)
        : Person.create(attrs)
      break
    }

    case CREATE_GROUP: {
      const me = Me.first()
      me.updateAppending({ memberships: [payload.getData().memberships.items[0].id] })
      clearCacheFor(Me, me.id)
      break
    }

    case CREATE_JOIN_REQUEST: {
      if (payload.getData().request) {
        const me = Me.first()
        const jr = JoinRequest.create({ group: meta.groupId, user: me.id })
        me.updateAppending({ joinRequests: [jr] })
      }
      break
    }

    case CANCEL_JOIN_REQUEST: {
      const jr = JoinRequest.withId(meta.id)
      jr.delete()
      break
    }

    case JOIN_PROJECT_PENDING: {
      const me = Me.first()
      ProjectMember.create({ post: meta.id, member: me.id })
      clearCacheFor(Post, meta.id)
      break
    }

    case LEAVE_PROJECT_PENDING: {
      const me = Me.first()
      session
        .ProjectMember
        .filter(member =>
          String(member.member) === String(me.id) &&
          String(member.post) === String(meta.id)
        )
        .toModelArray()
        .forEach(member => member.delete())
      clearCacheFor(Post, meta.id)
      break
    }

    case UPDATE_THREAD_READ_TIME_PENDING: {
      const thread = MessageThread.safeWithId(meta.id)
      if (thread) thread.update({ lastReadAt: new Date().toString() })
      break
    }

    case UPDATE_MEMBERSHIP_SETTINGS_PENDING: {
      const membership = Membership.safeGet({ group: meta.groupId })
      if (!membership) break
      membership.update({
        settings: {
          ...membership.settings,
          ...meta.settings
        }
      })
      break
    }

    case UPDATE_ALL_MEMBERSHIP_SETTINGS_PENDING: {
      const memberships = Membership.all()
      memberships.toModelArray().map(membership => {
        return membership.update({
          settings: {
            ...membership.settings,
            ...meta.settings
          }
        })
      })
      break
    }
  }

  values(sessionReducers).forEach(fn => fn(session, action))

  return session.state
}
