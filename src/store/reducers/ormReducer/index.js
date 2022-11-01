/* eslint-disable no-fallthrough */
import * as sessionReducers from './sessionReducers'
import {
  ACCEPT_GROUP_RELATIONSHIP_INVITE,
  ADD_MODERATOR_PENDING,
  CANCEL_GROUP_RELATIONSHIP_INVITE,
  CANCEL_JOIN_REQUEST,
  CREATE_COMMENT,
  CREATE_JOIN_REQUEST,
  DELETE_COMMENT_PENDING,
  DELETE_GROUP_RELATIONSHIP,
  FETCH_CURRENT_USER,
  FETCH_GROUP_DETAILS_PENDING,
  FETCH_MESSAGES_PENDING,
  // FETCH_POSTS_PENDING,
  INVITE_CHILD_TO_JOIN_PARENT_GROUP,
  INVITE_PEOPLE_TO_EVENT_PENDING,
  JOIN_PROJECT_PENDING,
  LEAVE_GROUP,
  LEAVE_PROJECT_PENDING,
  PROCESS_STRIPE_TOKEN_PENDING,
  REJECT_GROUP_RELATIONSHIP_INVITE,
  REMOVE_MODERATOR_PENDING,
  REQUEST_FOR_CHILD_TO_JOIN_PARENT_GROUP,
  RESET_NEW_POST_COUNT_PENDING,
  RESPOND_TO_EVENT_PENDING,
  TOGGLE_GROUP_TOPIC_SUBSCRIBE_PENDING,
  UPDATE_COMMENT_PENDING,
  UPDATE_GROUP_SETTINGS_PENDING,
  UPDATE_GROUP_SETTINGS,
  UPDATE_GROUP_TOPIC_PENDING,
  // UPDATE_POST_PENDING,
  UPDATE_POST,
  UPDATE_THREAD_READ_TIME,
  // UPDATE_USER_SETTINGS_PENDING as UPDATE_USER_SETTINGS_GLOBAL_PENDING,
  UPDATE_WIDGET,
  USE_INVITATION,
  VOTE_ON_POST_PENDING
} from 'store/constants'
import {
  CREATE_MESSAGE, CREATE_MESSAGE_PENDING, UPDATE_THREAD_READ_TIME_PENDING
} from 'screens/Thread/Thread.store'
import {
  UPDATE_LAST_VIEWED_PENDING
} from 'screens/ThreadList/ThreadList.store'
import {
  CREATE_GROUP
} from 'screens/CreateGroupFlow/CreateGroupFlow.store'
import {
  MARK_ACTIVITY_READ, MARK_ALL_ACTIVITIES_READ, UPDATE_NEW_NOTIFICATION_COUNT_PENDING
} from 'screens/NotificationsList/NotificationsList.store'

import orm from 'store/models'
import clearCacheFor from './clearCacheFor'
import { find, values, pick } from 'lodash/fp'
import extractModelsFromAction from '../ModelExtractor/extractModelsFromAction'
import { isPromise } from 'util/index'

export default function ormReducer (state = orm.getEmptyState(), action) {
  const session = orm.session(state)
  const { payload, type, meta, error } = action
  if (error) return state

  const {
    Activity,
    Comment,
    EventInvitation,
    Group,
    GroupRelationship,
    GroupRelationshipInvite,
    GroupTopic,
    Invitation,
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

  let me, membership, group, person, post, comment, groupTopic, childGroup

  switch (type) {
    case ACCEPT_GROUP_RELATIONSHIP_INVITE: {
      const newGroupRelationship = payload.data.acceptGroupRelationshipInvite.groupRelationship
      if (newGroupRelationship) {
        childGroup = Group.withId(newGroupRelationship.childGroup.id)
        Group.withId(newGroupRelationship.parentGroup.id).updateAppending({ childGroups: [childGroup] })
        GroupRelationshipInvite.withId(meta.id).delete()
        clearCacheFor(Group, childGroup.id)
      }
      break
    }

    case ADD_MODERATOR_PENDING: {
      person = Person.withId(meta.personId)
      Group.withId(meta.groupId).updateAppending({ moderators: [person] })
      break
    }

    case CANCEL_GROUP_RELATIONSHIP_INVITE:
    case REJECT_GROUP_RELATIONSHIP_INVITE: {
      const invite = GroupRelationshipInvite.withId(meta.id)
      invite.delete()
      break
    }

    case CANCEL_JOIN_REQUEST: {
      const jr = JoinRequest.withId(meta.id)
      jr.delete()
      break
    }

    // NOTE: HyloApp: Comments should not be optimistically added due to FlatList
    // animating the change when the ID of the new Comment row is added.
    // case CREATE_COMMENT_PENDING: {
    //   Comment.create({
    //     id: meta.tempId,
    //     post: meta.postId,
    //     text: meta.text,
    //     creator: Me.first().id
    //   })
    //   break
    // }

    case CREATE_COMMENT: {
      // Comment.withId(meta.tempId).delete()
      if (!PostCommenter.safeGet({ post: meta.postId, commenter: Me.first().id })) {
        PostCommenter.create({ post: meta.postId, commenter: Me.first().id })
        // we can assume the following because the backend returns the results pre-sorted
        // with the currentUser at the beginning
        const p = Post.withId(meta.postId)
        p.update({ commentersTotal: p.commentersTotal + 1 })
      }
      break
    }

    case CREATE_GROUP: {
      me = Me.withId(Me.first().id)
      me.updateAppending({ memberships: [payload.data.createGroup.memberships.items[0].id] })
      clearCacheFor(Me, me.id)
      break
    }

    case CREATE_JOIN_REQUEST: {
      if (payload.data.createJoinRequest.request) {
        me = Me.first()
        const jr = JoinRequest.create({ group: meta.groupId, user: me.id, status: payload.data.createJoinRequest.request.status })
        me.updateAppending({ joinRequests: [jr] })
      }
      break
    }

    case CREATE_MESSAGE: {
      Message.withId(meta.tempId).delete()
      const message = payload.data.createMessage
      MessageThread.withId(message.messageThread.id).newMessageReceived()
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

    case DELETE_COMMENT_PENDING: {
      const comment = Comment.withId(meta.id)
      const post = comment.post
      post.update({ commentsTotal: post.commentsTotal - 1 })
      comment.delete()
      break
    }

    case DELETE_GROUP_RELATIONSHIP: {
      if (payload.data.deleteGroupRelationship.success) {
        const gr = GroupRelationship.safeGet({ parentGroup: meta.parentId, childGroup: meta.childId })
        if (gr) {
          gr.delete()
          clearCacheFor(Group, meta.parentId)
          clearCacheFor(Group, meta.childId)
        }
      }
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

    case FETCH_GROUP_DETAILS_PENDING: {
      // Clear out prerequisite groups so they correclty update with latest data
      group = Group.safeGet({ slug: meta.slug })
      if (group) {
        group.update({ prerequisiteGroups: [] })
      }
      break
    }

    case FETCH_MESSAGES_PENDING: {
      if (meta.reset) {
        // this is so that after websocket reconnect events, pagination
        // of messages works as expected
        Message.filter({ messageThread: meta.id }).delete()
      }
      break
    }

    // case FETCH_POSTS_PENDING: {
    //   // When looking at group for first time, immediately set lastViewedAt so we know first view has happened
    //   // This is so that we can go to /explore page on first view then every time after go to regular home page
    //   if (meta.slug) {
    //     group = Group.safeGet({ slug: meta.slug })
    //     me = Me.first()
    //     if (!me) break
    //     membership = Membership.safeGet({ group: group.id, person: me.id })
    //     if (!membership) break
    //     membership && membership.update({ lastViewedAt: (new Date()).toISOString() }) // now non-members can possibly see the posts of a group, so in that instance, don't update
    //   }
    //   break
    // }

    case INVITE_CHILD_TO_JOIN_PARENT_GROUP: {
      const newGroupRelationship = payload.data.inviteGroupToJoinParent.groupRelationship
      if (newGroupRelationship) {
        clearCacheFor(Group, newGroupRelationship.parentGroup.id)
        clearCacheFor(Group, newGroupRelationship.childGroup.id)
      } else {
        const newGroupRelationshipInvite = payload.data.inviteGroupToJoinParent.groupRelationshipInvite
        if (newGroupRelationshipInvite) {
          clearCacheFor(Group, newGroupRelationshipInvite.toGroup.id)
          clearCacheFor(Group, newGroupRelationshipInvite.fromGroup.id)
        }
      }
      break
    }

    case INVITE_PEOPLE_TO_EVENT_PENDING: {
      meta.inviteeIds.forEach(inviteeId => {
        EventInvitation.create({
          event: meta.eventId,
          person: inviteeId
        })
      })
      clearCacheFor(Post, meta.eventId)
      break
    }

    case JOIN_PROJECT_PENDING: {
      me = Me.first()
      ProjectMember.create({ post: meta.id, member: me.id })
      clearCacheFor(Post, meta.id)
      break
    }

    case LEAVE_GROUP: {
      me = Me.first()
      membership = find(m => m.group.id === meta.id, me.memberships.toModelArray())
      if (membership) membership.delete()
      membership = Membership.safeGet({ group: meta.id, person: me.id })
      if (membership) membership.delete()
      break
    }

    case LEAVE_PROJECT_PENDING: {
      me = Me.first()
      const projectMember = find(
        m => String(m.member.id) === String(me.id) && String(m.post.id) === String(meta.id),
        ProjectMember.all().toModelArray()
      )
      if (projectMember) {
        projectMember.delete()
        clearCacheFor(Post, meta.id)
      }
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

    case PROCESS_STRIPE_TOKEN_PENDING: {
      post = Post.withId(meta.postId)
      const totalContributions = Number(post.totalContributions) + Number(meta.amount)
      post.update({
        totalContributions
      })
      break
    }

    case REMOVE_MODERATOR_PENDING: {
      group = Group.withId(meta.groupId)
      const moderators = group.moderators.filter(m =>
        m.id !== meta.personId)
        .toModelArray()
      group.update({ moderators })
      break
    }

    case RESET_NEW_POST_COUNT_PENDING: {
      if (meta.type === 'GroupTopic') {
        session.GroupTopic.withId(meta.id).update({ newPostCount: 0 })
      } else if (meta.type === 'Membership') {
        me = Me.first()
        const membership = Membership.safeGet({ group: meta.id, person: me.id })
        membership && membership.update({ newPostCount: 0 })
      }
      break
    }

    case REQUEST_FOR_CHILD_TO_JOIN_PARENT_GROUP: {
      const newGroupRelationship = payload.data.requestToAddGroupToParent.groupRelationship
      if (newGroupRelationship) {
        clearCacheFor(Group, newGroupRelationship.parentGroup.id)
        clearCacheFor(Group, newGroupRelationship.childGroup.id)
      } else {
        const newGroupRelationshipInvite = payload.data.requestToAddGroupToParent.groupRelationshipInvite
        if (newGroupRelationshipInvite) {
          clearCacheFor(Group, newGroupRelationshipInvite.toGroup.id)
          clearCacheFor(Group, newGroupRelationshipInvite.fromGroup.id)
        }
      }
      break
    }

    case RESPOND_TO_EVENT_PENDING: {
      const event = Post.withId(meta.id)
      event.update({ myEventResponse: meta.response })
      break
    }

    case TOGGLE_GROUP_TOPIC_SUBSCRIBE_PENDING: {
      groupTopic = GroupTopic.get({ topic: meta.topicId, group: meta.groupId })
      groupTopic.update({
        followersTotal: groupTopic.followersTotal + (meta.isSubscribing ? 1 : -1),
        isSubscribed: !!meta.isSubscribing
      })
      break
    }

    case UPDATE_COMMENT_PENDING: {
      comment = Comment.withId(meta.id)
      comment.update(meta.data)
      break
    }

    case UPDATE_GROUP_SETTINGS: {
      // Set new join questions in the ORM
      if (payload.data.updateGroupSettings && (payload.data.updateGroupSettings.joinQuestions || payload.data.updateGroupSettings.prerequisiteGroups)) {
        group = Group.withId(meta.id)
        clearCacheFor(Group, meta.id)
      }
      if (payload.data.updateGroupSettings && (payload.data.updateGroupSettings.customViews)) {
        group = Group.withId(meta.id)
        clearCacheFor(Group, meta.id)
      }
      break
    }

    case UPDATE_GROUP_SETTINGS_PENDING: {
      group = Group.withId(meta.id)
      group.update(meta.changes)
      me = Me.first()
      // Clear out prerequisiteGroups so they can be reset when the UPDATE completes
      group.update({ prerequisiteGroups: [] })

      // Triggers an update to redux-orm for the membership
      membership = Membership.safeGet({ group: meta.id, person: me.id }).update({ forceUpdate: new Date() })
      break
    }

    case UPDATE_GROUP_TOPIC_PENDING: {
      groupTopic = GroupTopic.withId(meta.id)
      groupTopic.update(meta.data)
      clearCacheFor(GroupTopic, meta.id)
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

    // case UPDATE_POST_PENDING: {
    //   // deleting all attachments and removing topics here because we restore them from the result of the UPDATE_POST action
    //   post = Post.withId(meta.id)
    //   post.attachments.toModelArray().map(a => a.delete())
    //   post.update({ topics: [] })
    //   break
    // }

    case UPDATE_POST: {
      // This is needed right now to make sure posts update in real time on the landing page
      if (payload.data.updatePost.groups) {
        payload.data.updatePost.groups.forEach(g => clearCacheFor(Group, g.id))
      }
      break
    }

    case UPDATE_THREAD_READ_TIME: {
      MessageThread.withId(meta.id).markAsRead()
      break
    }

    // case UPDATE_USER_SETTINGS_GLOBAL_PENDING: {
    //   me = Me.first()
    //   const changes = {
    //     ...meta.changes,
    //     settings: {
    //       ...me.settings,
    //       ...meta.changes.settings
    //     }
    //   }
    //   me.update(changes)
    //   break
    // }

    case UPDATE_THREAD_READ_TIME_PENDING: {
      const thread = MessageThread.safeWithId(meta.id)
      if (thread) thread.update({ lastReadAt: new Date().toString() })
      break
    }

    case UPDATE_WIDGET: {
      clearCacheFor(Group, payload.data.updateWidget.group.id)
      break
    }

    case USE_INVITATION: {
      me = Me.first()
      me.updateAppending({ memberships: [payload.data.useInvitation.membership.id] })
      Invitation.filter({ email: me.email, group: payload.data.useInvitation.membership.group.id }).delete()
      break
    }

    case VOTE_ON_POST_PENDING: {
      post = session.Post.withId(meta.postId)
      if (post.myVote) {
        !meta.isUpvote && post.update({ myVote: false, votesTotal: (post.votesTotal || 1) - 1 })
      } else {
        meta.isUpvote && post.update({ myVote: true, votesTotal: (post.votesTotal || 0) + 1 })
      }
      break
    }
  }

  values(sessionReducers).forEach(fn => fn(session, action))

  return session.state
}
