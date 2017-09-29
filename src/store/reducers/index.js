import { combineReducers } from 'redux'

import currentCommunity from './currentCommunity'
import ormReducer from './ormReducer'
import pending from './pending'
import { persist } from './persistence'
import queryResults from './queryResults'
import sessionReducer from './sessionReducer'
import handleLogout from './handleLogout'

import CommentEditor from '../../components/PostDetails/CommentEditor/CommentEditor.store'
import FeedList from '../../components/FeedList/FeedList.store'
import MemberFeed from '../../components/MemberProfile/MemberFeed/MemberFeed.store'
import Members from '../../components/Tabs/Members/Members.store'
import NewMessage from '../../components/NewMessage/NewMessage.store'
import PeopleTyping from '../../components/PeopleTyping/PeopleTyping.store'
import PostEditor from '../../components/PostEditor/PostEditor.store'
import Search from '../../components/Editor/Search/Search.store'
import SocketListener from '../../components/SocketListener/SocketListener.store'
import SignupFlow from '../../components/SignupFlow/SignupFlow.store'

const combinedReducers = combineReducers({
  orm: ormReducer,
  session: sessionReducer,
  pending,
  queryResults,
  currentCommunity,
  FeedList,
  PostEditor,
  Members,
  CommentEditor,
  Search,
  NewMessage,
  SocketListener,
  MemberFeed,
  SignupFlow,
  PeopleTyping
})

const composeReducers = (...reducers) => (state, action) =>
  reducers.reduce((newState, reducer) => reducer(newState, action), state)

export default persist(composeReducers(
  combinedReducers,
  handleLogout
))
