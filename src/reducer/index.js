import { LOGIN, LOGIN_WITH_FACEBOOK, LOGOUT } from '../components/Login/actions'
import { CHECK_SESSION } from '../components/SessionCheck/actions'
import { persist } from './persistence'
import { omit } from 'lodash/fp'
import { combineReducers } from 'redux'
import ormReducer from './ormReducer'
import pending from './pending'
import queryResults from './queryResults'
import FeedList from '../components/FeedList/FeedList.store'

function sessionReducer (state = {}, action) {
  const { type, error, payload, meta } = action

  if (error) {
    switch (type) {
      case LOGIN:
      case LOGIN_WITH_FACEBOOK:
        return {
          ...state,
          loginError: payload.message || payload.response.body
        }
    }
    return
  }

  switch (type) {
    case LOGIN:
      return {
        ...omit('loginError', state),
        loggedIn: true,
        defaultLoginEmail: meta.email
      }
    case LOGIN_WITH_FACEBOOK:
      return {
        ...omit('loginError', state),
        loggedIn: true
      }
    case CHECK_SESSION:
      if (payload !== state.loggedIn) {
        return {...state, loggedIn: payload}
      }
      return state
    case LOGOUT:
      return {
        ...state,
        loggedIn: false
      }
  }

  return state
}

const combinedReducers = combineReducers({
  orm: ormReducer,
  session: sessionReducer,
  pending,
  queryResults,
  FeedList
})

export default persist(combinedReducers)
