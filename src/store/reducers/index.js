import sessionReducer from './sessionReducer'
import { persist } from './persistence'
import { combineReducers } from 'redux'
import ormReducer from './ormReducer'
import pending from './pending'
import currentCommunity from './currentCommunity'
import queryResults from './queryResults'
import FeedList from '../../components/FeedList/FeedList.store'
import PostEditor from '../../components/PostEditor/PostEditor.store'
import CommentEditor from '../../components/PostDetails/CommentEditor/CommentEditor.store'
import Search from '../../components/Editor/Search/Search.store'
import NewMessage from '../../components/NewMessage/NewMessage.store'

const combinedReducers = combineReducers({
  orm: ormReducer,
  session: sessionReducer,
  pending,
  queryResults,
  currentCommunity,
  FeedList,
  PostEditor,
  CommentEditor,
  Search,
  NewMessage
})

export default persist(combinedReducers)
