import { connect } from 'react-redux'
import {
  signup,
  getUserSettings,
  updateUserSettings,
  updateLocalUserSettings,
  SIGNUP,
  UPDATE_USER_SETTINGS
} from '../SignupFlow.store.js'
import fetchCurrentUser from '../../../store/actions/fetchCurrentUser'
import getMe from '../../../store/selectors/getMe'
import { pick, omitBy, isNil } from 'lodash/fp'

export function mapStateToProps (state, props) {
  const currentUser = getMe(state, props)
  const { name, email, password } = getUserSettings(state)
  const pending = state.pending[SIGNUP] || state.pending[UPDATE_USER_SETTINGS]

  return {
    name,
    email,
    password,
    currentUser,
    pending,
    showPasswordField: !currentUser
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    signup: params => dispatch(signup(params)),
    changeSetting: setting => value => dispatch(updateLocalUserSettings({[setting]: value})),
    updateLocalUserSettings: settings => dispatch(updateLocalUserSettings(settings)),
    updateUserSettings: settings => dispatch(updateUserSettings(settings)),
    fetchCurrentUser: () => dispatch(fetchCurrentUser())
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const goToNext = () => ownProps.navigation.navigate('SignupFlow2')
  const { name, email, password, currentUser, showPasswordField } = stateProps
  const { signup, updateUserSettings, updateLocalUserSettings, fetchCurrentUser } = dispatchProps
  const saveFunc = currentUser ? updateUserSettings : signup

  const loadUserSettings = currentUser
   ? () => updateLocalUserSettings(pick([
     'name', 'email', 'location', 'avatarUrl', 'settings'
   ], currentUser.ref))
   : () => {}

  const signupOrUpdate = () => saveFunc(omitBy(isNil, {
    name,
    email,
    password: showPasswordField ? password : null
  }))
  .then(({ error }) => {
    if (error) return
    return goToNext()
  })

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    signupOrUpdate,
    loadUserSettings,
    fetchCurrentUser
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
