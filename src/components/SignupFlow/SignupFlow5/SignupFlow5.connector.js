import { connect } from 'react-redux'
import {
  signup, getUserSettings, getUserSkills, updateUserSettings, updateLocalUserSettings, defaultUserSettings
} from '../SignupFlow.store.js'
import { isEmpty } from 'lodash/fp'

export function mapStateToProps (state, props) {
  const { name, email, password, confirmPassword, location, avatarUrl } = getUserSettings(state)
  const skills = getUserSkills(state)
  const showPasswordField = !isEmpty(password)

  return {
    name,
    email,
    password,
    confirmPassword,
    location,
    avatarUrl,
    skills,
    showPasswordField
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
  const updateSetting = (key, value) => updateUserSettings({[key]: value})
  const updateLocalSetting = (key, value) => updateLocalUserSettings({[key]: value})
  const makeChanges = () => ownProps.navigation.navigate('SignupFlow1')
  const goToImage = () => ownProps.navigation.navigate('SignupFlow2')
  const goToSkills = () => ownProps.navigation.navigate('SignupFlow4')

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    finishSignup,
    makeChanges,
    updateSetting,
    updateLocalSetting,
    goToImage,
    goToSkills
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
