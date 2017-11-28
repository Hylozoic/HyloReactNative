import { connect } from 'react-redux'
import {
  signup,
  getUserSettings,
  updateUserSettings,
  updateLocalUserSettings,
  defaultUserSettings
} from '../SignupFlow.store.js'
import {
  getSkillsFromOrm
} from '../../SkillEditor/SkillEditor.store'
import { isEmpty } from 'lodash/fp'
import { redirectAfterLogin, resetToRoute } from 'util/navigation'
import { getNavigationAction } from '../../DeepLinkHandler/DeepLinkHandler.store'

export function mapStateToProps (state, props) {
  const { name, email, password, confirmPassword, location, avatarUrl } = getUserSettings(state)
  const skills = getSkillsFromOrm(state).map(s => s.name)
  const showPasswordField = !isEmpty(password)

  return {
    name,
    email,
    password,
    confirmPassword,
    location,
    avatarUrl,
    skills,
    showPasswordField,
    deepLinkAction: getNavigationAction(state)
  }
}

export const mapDispatchToProps = {
  signup, updateUserSettings, updateLocalUserSettings
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { updateUserSettings, updateLocalUserSettings } = dispatchProps
  const { navigation } = ownProps
  const { deepLinkAction } = stateProps

  const finishSignup = () => {
    updateLocalUserSettings(defaultUserSettings)
    updateUserSettings({settings: {signupInProgress: false}})
    if (deepLinkAction) {
      redirectAfterLogin({navigation, action: deepLinkAction})
    } else {
      resetToRoute(navigation, 'Main')
    }
  }
  const updateSetting = (key, value) => updateUserSettings({[key]: value})
  const updateLocalSetting = (key, value) => updateLocalUserSettings({[key]: value})
  const makeChanges = () => navigation.navigate('SignupFlow1')
  const goToImage = () => navigation.navigate('SignupFlow2')
  const goToSkills = () => navigation.navigate('SignupFlow4')

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
