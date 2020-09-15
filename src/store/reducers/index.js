import { combineReducers } from 'redux'
import resetStore from './resetStore'
import ormReducer from './ormReducer'
import pending from './pending'
import queryResults from './queryResults'
import currentNetworkAndCommunity from './currentNetworkAndCommunity'
import sessionReducer from './sessionReducer'
import mixpanelReducer from './mixpanel'
import CommentEditor from '../../components/PostDetails/CommentEditor/CommentEditor.store'
import DeepLinkHandler from '../../components/DeepLinkHandler/DeepLinkHandler.store'
import FeedList from '../../components/FeedList/FeedList.store'
import ItemChooser from '../../components/ItemChooser/ItemChooser.store'
import LoadingModal from '../../components/LoadingModal/LoadingModal.store'
import MemberFeed from '../../components/MemberProfile/MemberFeed/MemberFeed.store'
import Members from '../../components/Tabs/Members/Members.store'
import ModeratorSettings from '../../components/ModeratorSettings/ModeratorSettings.store'
import NewMessage from '../../components/NewMessage/NewMessage.store'
import PeopleTyping from '../../components/PeopleTyping/PeopleTyping.store'
import PostEditor from '../../components/PostEditor/PostEditor.store'
import SkillEditor from '../../components/SkillEditor/SkillEditor.store'
import SignupFlow from '../../components/SignupFlow/SignupFlow.store'
import SocketListener from '../../components/SocketListener/SocketListener.store'
import TabBar from '../../components/RootNavigator/TabBar/TabBar.store'
import Topics from '../../components/Tabs/Topics/Topics.store'
import CreateCommunityFlow from '../../components/CreateCommunityFlow/CreateCommunityFlow.store'
import SearchPage from '../../components/SearchPage/SearchPage.store'

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
  TabBar,
  Topics,
  CreateCommunityFlow
})

const composeReducers = (...reducers) => (state, action) =>
  reducers.reduce((newState, reducer) => reducer(newState, action), state)

export default composeReducers(
  combinedReducers,
  resetStore
)
