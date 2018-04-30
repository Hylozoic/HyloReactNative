import * as sessionReducers from './sessionReducers'
import { values, pick } from 'lodash/fp'
import {
  UPDATE_COMMUNITY_SETTINGS_PENDING
} from '../../../components/CommunitySettings/CommunitySettings.store'
import {
  UPDATE_USER_SETTINGS_PENDING
} from '../../actions/updateUserSettings'
import {
  ADD_SKILL, REMOVE_SKILL
} from '../../../components/SkillEditor/SkillEditor.store'
import {
  CREATE_COMMENT
} from '../../../components/PostDetails/CommentEditor/CommentEditor.store'
import {
  SET_TOPIC_SUBSCRIBE_PENDING
} from '../../../components/Feed/Feed.store'
import {
  MARK_ACTIVITY_READ, MARK_ALL_ACTIVITIES_READ, UPDATE_NEW_NOTIFICATION_COUNT_PENDING
} from '../../../components/NotificationsList/NotificationsList.store'
import {
  CREATE_MESSAGE, CREATE_MESSAGE_PENDING, UPDATE_THREAD_READ_TIME_PENDING
} from '../../../components/Thread/Thread.store'
import {
  VOTE_ON_POST_PENDING
} from '../../../components/PostCard/PostFooter/PostFooter.store'
import {
  USE_INVITATION
} from '../../../components/JoinCommunity/JoinCommunity.store'
import {
  DELETE_COMMENT_PENDING
} from '../../../components/Comment/Comment.store'
import {
  UPDATE_LAST_VIEWED_PENDING
} from '../../../components/ThreadList/ThreadList.store'
import {
  CREATE_COMMUNITY
} from '../../../components/CreateCommunityFlow/CreateCommunityFlow.store'
import {
  UPDATE_MEMBERSHIP_SETTINGS_PENDING
} from '../../../components/NotificationSettings/NotificationSettings.store'

import { RESET_NEW_POST_COUNT_PENDING } from '../../actions/resetNewPostCount'
import { PIN_POST_PENDING } from '../../../components/PostCard/PostHeader/PostHeader.store'
import { FETCH_CURRENT_USER } from 'store/actions/fetchCurrentUser'
import orm from 'store/models'
import ModelExtractor from '../ModelExtractor'
import extractModelsFromAction from '../ModelExtractor/extractModelsFromAction'
import { isPromise } from 'util/index'

export default function ormReducer (state = {}, action) {
  const session = orm.session(state)
  const { payload, type, meta, error } = action
  if (error) return state

  if (payload && !isPromise(payload) && meta && meta.extractModel) {
    extractModelsFromAction(action, session)
  }

  let me, skill, post, thread, community, membership

  switch (type) {
    case CREATE_COMMENT:
      post = session.Post.safeGet({id: meta.postId})
      if (!post) break
      post.update({commentsTotal: (post.commentsTotal || 0) + 1})
      break

    case CREATE_MESSAGE_PENDING:
      session.Message.create({
        id: meta.tempId,
        messageThread: meta.messageThreadId,
        text: meta.text,
        createdAt: new Date().toString(),
        creator: session.Me.first().id
      })
      break

    case CREATE_MESSAGE:
      // remove the temporary message and then create the real one -- we do this
      // here instead of using meta.extractModel so it all happens in a single
      // reduce. we can't just update the temporary message because redux-orm
      // doesn't support updating ID's
      session.Message.withId(meta.tempId).delete()
      ModelExtractor.addAll({
        session,
        root: payload.data.createMessage,
        modelName: 'Message'
      })
      break

    case MARK_ACTIVITY_READ:
      if (session.Activity.hasId(meta.id)) {
        session.Activity.withId(meta.id).update({ unread: false })
      }
      break

    case MARK_ALL_ACTIVITIES_READ:
      session.Activity.all().update({ unread: false })
      break

    case ADD_SKILL:
      me = session.Me.first()
      skill = session.Skill.create(payload.data.addSkill)
      me.updateAppending({skills: [skill]})
      break

    case REMOVE_SKILL:
      me = session.Me.first()
      skill = session.Skill.safeGet({name: meta.name})
      if (skill) {
        me.skills.remove(skill.id)
      }
      break

    case VOTE_ON_POST_PENDING:
      post = session.Post.withId(meta.postId)
      if (post.myVote) {
        !meta.isUpvote && post.update({myVote: false, votesTotal: (post.votesTotal || 1) - 1})
      } else {
        meta.isUpvote && post.update({myVote: true, votesTotal: (post.votesTotal || 0) + 1})
      }
      break

    case UPDATE_USER_SETTINGS_PENDING:
      me = session.Me.first()
      const changes = {
        ...meta.changes,
        settings: {
          ...me.settings,
          ...meta.changes.settings
        }
      }
      me.update(changes)
      if (session.Person.hasId(me.id)) {
        session.Person.withId(me.id).update(changes)
      }
      break

    case UPDATE_COMMUNITY_SETTINGS_PENDING:
      community = session.Community.withId(meta.id)
      community.update(meta.changes)

      membership = session.Membership.safeGet({community: meta.id}).update({forceUpdate: new Date()})
      break

    case SET_TOPIC_SUBSCRIBE_PENDING:
      const ct = session.CommunityTopic.get({
        topic: meta.topicId, community: meta.communityId
      })
      ct.update({
        followersTotal: ct.followersTotal + (meta.isSubscribing ? 1 : -1),
        isSubscribed: !!meta.isSubscribing
      })
      break

    case USE_INVITATION:
      me = session.Me.first()
      me.updateAppending({memberships: [payload.data.useInvitation.membership.id]})
      break

    case DELETE_COMMENT_PENDING:
      const comment = session.Comment.withId(meta.id)
      post = comment.post
      post.update({ commentsTotal: post.commentsTotal - 1 })
      comment.delete()
      break

    case UPDATE_LAST_VIEWED_PENDING:
      me = session.Me.first()
      me.update({
        unseenThreadCount: 0
      })
      break

    case UPDATE_NEW_NOTIFICATION_COUNT_PENDING:
      me = session.Me.first()
      me.update({
        newNotificationCount: 0
      })
      break

    case RESET_NEW_POST_COUNT_PENDING:
      const { id } = meta.graphql.variables
      membership = session.Membership.safeGet({community: id})
      if (!membership) break
      membership.update({newPostCount: 0})
      break

    case PIN_POST_PENDING:
      post = session.Post.withId(meta.postId)
      // this line is to clear the selector memoization
      post.update({_invalidate: (post._invalidate || 0) + 1})
      let postMembership = post.postMemberships.filter(p =>
        Number(p.community) === Number(meta.communityId)).toModelArray()[0]
      postMembership && postMembership.update({pinned: !postMembership.pinned})
      break

    case FETCH_CURRENT_USER:
      const attrs = pick(['id', 'avatarUrl', 'name', 'location'], payload.data.me)
      session.Person.create(attrs)
      break

    case CREATE_COMMUNITY:
      me = session.Me.first()
      me.updateAppending({memberships: [payload.data.createCommunity.id]})
      break

    case UPDATE_THREAD_READ_TIME_PENDING:
      thread = session.MessageThread.safeWithId(meta.id)
      if (thread) thread.update({lastReadAt: new Date().toString()})
      break

    case UPDATE_MEMBERSHIP_SETTINGS_PENDING:
      membership = session.Membership.safeGet({community: meta.communityId})
      if (!membership) break
      membership.update({
        settings: {
          ...membership.settings,
          ...meta.settings
        }
      })
      break
  }

  values(sessionReducers).forEach(fn => fn(session, action))
  return session.state
}
