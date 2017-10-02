import { connect } from 'react-redux'
import {
  signup, getUserSettings, getUserSkills, updateUserSettings, updateLocalUserSettings, defaultUserSettings
} from '../SignupFlow.store.js'

export function mapStateToProps (state, props) {
  const { name, email, password, location, avatarUrl } = getUserSettings(state)
  const skills = getUserSkills(state)

  return {
    name,
    email,
    password,
    location,
    avatarUrl,
    skills
  }
}

export const mapDispatchToProps = {
  signup, updateUserSettings, updateLocalUserSettings
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { updateUserSettings, updateLocalUserSettings } = dispatchProps
  const finishSignup = () => {
    updateLocalUserSettings(defaultUserSettings)
    updateUserSettings({settings: {signupInProgress: false}})
  }
  const makeChanges = () => ownProps.navigation.navigate('SignupFlow1')

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    finishSignup,
    makeChanges
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
