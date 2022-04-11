import { combineReducers } from 'redux'
import { pick } from 'lodash/fp'
import ormReducer from './ormReducer'
import pending from './pending'
import queryResults from './queryResults'
import sessionReducer from './sessionReducer'
import returnToPathReducer from './returnToPathReducer'
import mixpanelReducer from './mixpanel'
import CommentEditor from 'screens/PostDetails/CommentEditor/CommentEditor.store'
import FeedList from 'components/FeedList/FeedList.store'
import ItemChooser from 'screens/ItemChooser/ItemChooser.store'
import MemberFeed from 'screens/MemberProfile/MemberFeed/MemberFeed.store'
import Members from 'screens/Members/Members.store'
import ModeratorSettings from 'screens/ModeratorSettings/ModeratorSettings.store'
import NewMessage from 'screens/NewMessage/NewMessage.store'
import PeopleTyping from 'components/PeopleTyping/PeopleTyping.store'
import SkillEditor from 'components/SkillEditor/SkillEditor.store'
import SocketListener from 'components/SocketListener/SocketListener.store'
import Topics from 'screens/Topics/Topics.store'
import CreateGroupFlow from 'screens/CreateGroupFlow/CreateGroupFlow.store'
import SearchPage from 'screens/SearchPage/SearchPage.store'
import { LOGOUT, RESET_STORE } from 'store/constants'

export const appReducer = combineReducers({
  orm: ormReducer,
  pending,
  queryResults,
  session: sessionReducer,
  returnToPath: returnToPathReducer,
  mixpanel: mixpanelReducer,
  CommentEditor,
  FeedList,
  ItemChooser,
  MemberFeed,
  Members,
  ModeratorSettings,
  NewMessage,
  PeopleTyping,
  SearchPage,
  SkillEditor,
  SocketListener,
  Topics,
  CreateGroupFlow
})

const composeReducers = (...reducers) => (state, action) =>
  reducers.reduce((newState, reducer) => reducer(newState, action), state)

export const KEYS_PRESERVED_ON_RESET = [
  'session',
  'SocketListener'
]

export function rootReducer (state, action) {
  const { type, error } = action

  if (error) return state

  if (type === LOGOUT) {
    return appReducer(undefined, action)
  }

  if (type === RESET_STORE) {
    return appReducer(pick(KEYS_PRESERVED_ON_RESET, state), action)
  }

  return appReducer(state, action)
}

export default composeReducers(appReducer)
