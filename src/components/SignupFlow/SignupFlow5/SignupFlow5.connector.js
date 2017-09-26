import { connect } from 'react-redux'
import fetchCurrentUser from '../../../store/actions/fetchCurrentUser'
import getMe from '../../../store/selectors/getMe'
import { signup, getUserSettings, getUserSkills, updateLocalUserSettings } from '../SignupFlow.store.js'
import { login } from '../../Login/actions'
import { pick } from 'lodash/fp'

export function mapStateToProps (state, props) {
  const { name, email, password, location, avatarUrl } = getUserSettings(state)
  const skills = getUserSkills(state)
  const currentUser = getMe(state)

  return {
    name,
    email,
    password,
    location,
    avatarUrl,
    skills,
    currentUser
  }
}

export const mapDispatchToProps = {
  signup, login, updateLocalUserSettings, fetchCurrentUser
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { email, password, currentUser } = stateProps
  const login = () => {
    console.log('calling login with', email, password)
    login(email, password)
  }
  const makeChanges = () => ownProps.navigation.navigate('SignupFlow1')

  const loadUserSettings = () => currentUser
    ? dispatchProps.updateLocalUserSettings(pick(['name', 'email', 'avatarUrl', 'location'], currentUser.ref))
    : () => {}

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    login,
    makeChanges,
    loadUserSettings
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
