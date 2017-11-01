import { combineReducers } from 'redux'
import currentCommunity from './currentCommunity'
import handleLogout from './handleLogout'
import ormReducer from './ormReducer'
import pending from './pending'
import queryResults from './queryResults'
import sessionReducer from './sessionReducer'
import CommentEditor from '../../components/PostDetails/CommentEditor/CommentEditor.store'
import FeedList from '../../components/FeedList/FeedList.store'
import LoadingModal from '../../components/LoadingModal/LoadingModal.store'
import MemberFeed from '../../components/MemberProfile/MemberFeed/MemberFeed.store'
import Members from '../../components/Tabs/Members/Members.store'
import NewMessage from '../../components/NewMessage/NewMessage.store'
import PeopleTyping from '../../components/PeopleTyping/PeopleTyping.store'
import PostEditor from '../../components/PostEditor/PostEditor.store'
import Search from '../../components/Editor/Search/Search.store'
import SignupFlow from '../../components/SignupFlow/SignupFlow.store'
import SocketListener from '../../components/SocketListener/SocketListener.store'
import TabBar from '../../components/RootNavigator/TabBar/TabBar.store'

export const combinedReducers = combineReducers({
  currentCommunity,
  orm: ormReducer,
  pending,
  queryResults,
  session: sessionReducer,

  CommentEditor,
  FeedList,
  LoadingModal,
  MemberFeed,
  Members,
  NewMessage,
  PeopleTyping,
  PostEditor,
  Search,
  SignupFlow,
  SocketListener,
  TabBar
})

const composeReducers = (...reducers) => (state, action) =>
  reducers.reduce((newState, reducer) => reducer(newState, action), state)

export default composeReducers(
  combinedReducers,
  handleLogout
)
