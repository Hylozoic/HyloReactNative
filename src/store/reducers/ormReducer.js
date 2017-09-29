import { LOGOUT } from '../../components/Login/actions'
import { SIGNUP, ADD_SKILL, REMOVE_SKILL, UPDATE_USER_SETTINGS_PENDING } from '../../components/SignupFlow/SignupFlow.store'
import {
  CREATE_COMMENT
} from '../../components/PostDetails/CommentEditor/CommentEditor.store'
import {
  RECEIVE_MESSAGE
} from '../../components/SocketListener/SocketListener.store'
import { CREATE_MESSAGE, CREATE_MESSAGE_PENDING } from '../../components/Thread/Thread.store'
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

  var me, skill

  switch (type) {
    case LOGOUT:
      me = session.Me.first()
      if (me) {
        me.memberships.delete()
        me.delete()
      }
      break

    case CREATE_COMMENT:
      const post = session.Post.safeGet({id: meta.postId})
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

    case RECEIVE_MESSAGE:
      const { message } = payload.data
      session.MessageThread.withId(message.messageThread)
      .update({updatedAt: message.createdAt})
      break
  }

  return session.state
}
