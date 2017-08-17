import { EXTRACT_MODEL } from '../constants'
import { LOGOUT } from '../../components/Login/actions'
import {
  CREATE_COMMENT
} from '../../components/PostDetails/CommentEditor/CommentEditor.store'
import { CREATE_MESSAGE_PENDING } from '../../components/Thread/Thread.store'
import orm from '../models'
import ModelExtractor from './ModelExtractor'

export default function ormReducer (state = {}, action) {
  const session = orm.session(state)
  const { payload, type, meta, error } = action
  if (error) return state

  switch (type) {
    case LOGOUT:
      const me = session.Me.first()
      me.memberships.delete()
      me.delete()
      break

    case EXTRACT_MODEL:
      ModelExtractor.addAll({
        session,
        root: payload,
        modelName: meta.modelName,
        append: meta.append
      })
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
  }

  return session.state
}
