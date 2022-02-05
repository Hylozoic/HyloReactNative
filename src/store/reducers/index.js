import { combineReducers } from 'redux'
import resetStore from './resetStore'
import ormReducer from './ormReducer'
import pending from './pending'
import queryResults from './queryResults'
import sessionReducer from './sessionReducer'
import mixpanelReducer from './mixpanel'
import CommentEditor from 'screens/PostDetails/CommentEditor/CommentEditor.store'
import FeedList from 'components/FeedList/FeedList.store'
import ItemChooser from 'screens/ItemChooser/ItemChooser.store'
import LoadingModal from 'screens/LoadingModal/LoadingModal.store'
import MemberFeed from 'screens/MemberProfile/MemberFeed/MemberFeed.store'
import Members from 'screens/Members/Members.store'
import ModeratorSettings from 'screens/ModeratorSettings/ModeratorSettings.store'
import NewMessage from 'screens/NewMessage/NewMessage.store'
import PeopleTyping from 'components/PeopleTyping/PeopleTyping.store'
import SkillEditor from 'components/SkillEditor/SkillEditor.store'
import SignupFlow from 'screens/SignupFlow/SignupFlow.store'
import SocketListener from 'components/SocketListener/SocketListener.store'
import Topics from 'screens/Topics/Topics.store'
import CreateGroupFlow from 'screens/CreateGroupFlow/CreateGroupFlow.store'
import SearchPage from 'screens/SearchPage/SearchPage.store'

export const combinedReducers = combineReducers({
  orm: ormReducer,
  pending,
  queryResults,
  session: sessionReducer,
  mixpanel: mixpanelReducer,
  CommentEditor,
  // DeepLinkHandler,
  FeedList,
  ItemChooser,
  LoadingModal,
  MemberFeed,
  Members,
  ModeratorSettings,
  NewMessage,
  PeopleTyping,
  SearchPage,
  SignupFlow,
  SkillEditor,
  SocketListener,
  Topics,
  CreateGroupFlow
})

const composeReducers = (...reducers) => (state, action) =>
  reducers.reduce((newState, reducer) => reducer(newState, action), state)

export default composeReducers(
  combinedReducers,
  resetStore
)
