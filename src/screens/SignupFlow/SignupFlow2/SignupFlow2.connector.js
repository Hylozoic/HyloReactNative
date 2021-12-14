import { connect } from 'react-redux'
import { pick } from 'lodash/fp'
import { getUserSettings, updateLocalUserSettings } from '../SignupFlow.store.js'
import updateUserSettings from 'store/actions/updateUserSettings'
import getMe from 'store/selectors/getMe'

export function mapStateToProps (state, props) {
  const currentUser = getMe(state, props)
  const { avatarUrl } = getUserSettings(state)
  return {
    currentUser,
    avatarUrl
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    changeSetting: setting => value => dispatch(updateLocalUserSettings({ [setting]: value })),
    updateLocalUserSettings: settings => dispatch(updateLocalUserSettings(settings)),
    updateUserSettings: settings => dispatch(updateUserSettings(settings))
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { currentUser, avatarUrl } = stateProps
  const { updateLocalUserSettings } = dispatchProps
  const loadUserSettings = async () => (
    updateLocalUserSettings(pick([
      'name', 'location', 'avatarUrl', 'settings'
    ], currentUser.ref))
  )
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    loadUserSettings,
    saveAndNext: () => {
      dispatchProps.updateUserSettings({ avatarUrl })
        .then(({ error }) => {
          if (error) return
          return ownProps.navigation.navigate('SignupFlow3')
        })
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
