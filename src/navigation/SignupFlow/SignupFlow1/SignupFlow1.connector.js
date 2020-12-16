import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import fetchCurrentUser from 'store/actions/fetchCurrentUser'
import {
  signup,
  getUserSettings,
  getSignupErrors,
  updateUserSettings,
  updateLocalUserSettings,
  SIGNUP,
  UPDATE_USER_SETTINGS
} from '../SignupFlow.store.js'
import getMe from 'store/selectors/getMe'
import { pick, omitBy, isNil } from 'lodash/fp'

export function mapStateToProps (state, props) {
  const currentUser = getMe(state, props)
  const { name, email, password, confirmPassword } = getUserSettings(state)
  const pending = state.pending[SIGNUP] || state.pending[UPDATE_USER_SETTINGS]
  const errors = getSignupErrors(state)

  return {
    name,
    email,
    password,
    confirmPassword,
    currentUser,
    pending,
    showPasswordField: !currentUser,
    errors
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    signup: params => dispatch(signup(params)),
    changeSetting: (setting, value) => dispatch(updateLocalUserSettings({ [setting]: value })),
    ...bindActionCreators({
      updateLocalUserSettings,
      updateUserSettings,
      fetchCurrentUser
    }, dispatch)
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { name, email, password, currentUser, showPasswordField } = stateProps
  const {
    signup, updateUserSettings, updateLocalUserSettings, fetchCurrentUser
  } = dispatchProps
  
  const loadUserSettings = () => (
    updateLocalUserSettings(pick([
      'name', 'email', 'location', 'avatarUrl', 'settings'
    ], currentUser.ref))
  )

  const signupOrUpdate = () => {
    const params = omitBy(isNil, {
      name,
      email,
      password: showPasswordField
        ? password
        : null
    })
    const saveFunc = currentUser
      ? updateUserSettings
      : signup

    return saveFunc(params)
      .then(({ error }) => {
        if (!error) {
          // if (currentUser) {
          //   ownProps.navigation.navigate('SignupFlow2')
          // } else {
            fetchCurrentUser()
              .then(() => {
                ownProps.navigation.navigate('SignupFlow2')
              })
          // }
        }
      })
  }

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    signupOrUpdate,
    loadUserSettings
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
