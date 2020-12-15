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
  const goToNext = () => ownProps.navigation.navigate('SignupFlow3')
  const { avatarUrl } = stateProps
  const saveAndNext = () => {
    dispatchProps.updateUserSettings({ avatarUrl })
      .then(({ error }) => {
        if (error) return
        return goToNext()
      })
  }

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    saveAndNext
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
