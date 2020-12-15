import { combineReducers } from 'redux'
import resetStore from './resetStore'
import ormReducer from './ormReducer'
import pending from './pending'
import queryResults from './queryResults'
import currentNetworkAndCommunity from './currentNetworkAndCommunity'
import sessionReducer from './sessionReducer'
import mixpanelReducer from './mixpanel'
import CommentEditor from 'navigation/PostDetails/CommentEditor/CommentEditor.store'
import DeepLinkHandler from 'routing/DeepLinkHandler/DeepLinkHandler.store'
import FeedList from 'navigation/FeedList/FeedList.store'
import ItemChooser from 'navigation/ItemChooser/ItemChooser.store'
import LoadingModal from 'navigation/LoadingModal/LoadingModal.store'
import MemberFeed from 'navigation/MemberProfile/MemberFeed/MemberFeed.store'
import Members from 'navigation/Tabs/Members/Members.store'
import ModeratorSettings from 'navigation/ModeratorSettings/ModeratorSettings.store'
import NewMessage from 'navigation/NewMessage/NewMessage.store'
import PeopleTyping from 'components/PeopleTyping/PeopleTyping.store'
import PostEditor from 'navigation/PostEditor/PostEditor.store'
import SkillEditor from 'components/SkillEditor/SkillEditor.store'
import SignupFlow from 'navigation/SignupFlow/SignupFlow.store'
import SocketListener from 'components/SocketListener/SocketListener.store'
import Topics from 'navigation/Tabs/Topics/Topics.store'
import CreateCommunityFlow from 'navigation/CreateCommunityFlow/CreateCommunityFlow.store'
import SearchPage from 'navigation/SearchPage/SearchPage.store'

export const combinedReducers = combineReducers({
  orm: ormReducer,
  pending,
  queryResults,
  currentNetworkAndCommunity,
  session: sessionReducer,
  mixpanel: mixpanelReducer,
  CommentEditor,
  DeepLinkHandler,
  FeedList,
  ItemChooser,
  LoadingModal,
  MemberFeed,
  Members,
  ModeratorSettings,
  NewMessage,
  PeopleTyping,
  PostEditor,
  SearchPage,
  SignupFlow,
  SkillEditor,
  SocketListener,
  Topics,
  CreateCommunityFlow
})

const composeReducers = (...reducers) => (state, action) =>
  reducers.reduce((newState, reducer) => reducer(newState, action), state)

export default composeReducers(
  combinedReducers,
  resetStore
)
