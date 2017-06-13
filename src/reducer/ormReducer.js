import { EXTRACT_MODEL } from '../store/constants'
import { LOGOUT } from '../components/Login/actions'
import orm from '../store/models'
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
  }

  return session.state
}
