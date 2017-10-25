import {
  UPDATE_USER_SETTINGS_PENDING
} from '../actions/updateUserSettings'
import {
  SIGNUP, ADD_SKILL, REMOVE_SKILL
} from '../../components/SignupFlow/SignupFlow.store'
import {
  CREATE_COMMENT
} from '../../components/PostDetails/CommentEditor/CommentEditor.store'
import {
  TOGGLE_TOPIC_SUBSCRIBE_PENDING
} from '../../components/Feed/Feed.store'
import {
  MARK_ACTIVITY_READ, MARK_ALL_ACTIVITIES_READ
} from '../../components/NotificationsList/NotificationsList.store'
import {
  RECEIVE_MESSAGE, RECEIVE_NOTIFICATION, RECEIVE_THREAD
} from '../../components/SocketListener/SocketListener.store'
import {
  CREATE_MESSAGE, CREATE_MESSAGE_PENDING
} from '../../components/Thread/Thread.store'
import {
  VOTE_ON_POST_PENDING
} from '../../components/PostCard/PostFooter/PostFooter.store'
import {
  USE_INVITATION
} from '../../components/JoinCommunity/JoinCommunity.store'
import {
  UPDATE_LAST_VIEWED_PENDING
} from '../../components/ThreadList/ThreadList.store'
import orm from '../models'
import ModelExtractor from './ModelExtractor'
import extractModelsFromAction from './ModelExtractor/extractModelsFromAction'
import { isPromise } from 'util/index'

export default function ormReducer (state = {}, action) {
  const session = orm.session(state)
  const { payload, type, meta, error } = action
  if (error) return state

  if (payload && !isPromise(payload) && meta && meta.extractModel) {
    extractModelsFromAction(action, session)
  }

  let me, skill, post

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

    case SIGNUP:
      me = session.Me.first()
      if (me) {
        me.delete()
      }
      session.Me.create({
        name: payload.name,
        email: payload.email,
        settings: {
          signupInProgress: true
        }
      })
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
      break

    case RECEIVE_NOTIFICATION:
      // TODO: eventually we might want to refactor this out into a more
      // structured activity.action handler for the various counts that need
      // bumping (or handle every single damn thing in ModelExtractor).
      const { notification } = payload.data
      const newNotificationCount = session.Me.first().newNotificationCount + 1
      session.Me.first().update({ newNotificationCount })

      const { activity } = notification
      if (activity.action === 'newComment' && session.Post.hasId(activity.post.id)) {
        const post = session.Post.withId(activity.post.id)
        post.update({ commentsTotal: post.commentsTotal + 1 })
      }
      break

    case TOGGLE_TOPIC_SUBSCRIBE_PENDING:
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

    case UPDATE_LAST_VIEWED_PENDING:
      me = session.Me.first()
      me.update({
        unseenThreadCount: 0
      })
  }

  return session.state
}
