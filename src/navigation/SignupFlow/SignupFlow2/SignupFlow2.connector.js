import { connect } from 'react-redux'
import { getUserSettings, updateLocalUserSettings, updateUserSettings } from '../SignupFlow.store.js'
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
    updateUserSettings: settings => dispatch(updateUserSettings(settings))
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { avatarUrl } = stateProps

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
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
