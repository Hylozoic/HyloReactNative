import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import fetchCurrentUser from 'store/actions/fetchCurrentUser'
import {
  signup,
  getUserSettings,
  getSignupErrors,
  updateLocalUserSettings,
  SIGNUP
} from '../SignupFlow.store.js'
import { UPDATE_USER_SETTINGS } from 'store/constants'
import updateUserSettings from 'store/actions/updateUserSettings'
import getMe from 'store/selectors/getMe'
import { pick, omitBy, isNil } from 'lodash/fp'

export function mapStateToProps (state, props) {
  const currentUser = getMe(state, props)
  const { name, password, confirmPassword } = getUserSettings(state)
  const pending = state.pending[SIGNUP] || state.pending[UPDATE_USER_SETTINGS]
  const errors = getSignupErrors(state)

  return {
    name,
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
  const { name, password, currentUser, showPasswordField } = stateProps
  const {
    signup, updateUserSettings, updateLocalUserSettings, fetchCurrentUser
  } = dispatchProps
  
  const loadUserSettings = async () => (
    updateLocalUserSettings(pick([
      'name', 'location', 'avatarUrl', 'settings'
    ], currentUser.ref))
  )

  const signupOrUpdate = async() => {
    const params = omitBy(isNil, {
      name,
      password: showPasswordField
        ? password
        : null
    })

    try {
      if (currentUser) {
        await updateUserSettings(params)
      } else {
        await signup(params)
        await fetchCurrentUser()
      }
      ownProps.navigation.navigate('SignupFlow2')
    } catch (error) {
      return error
    }
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
