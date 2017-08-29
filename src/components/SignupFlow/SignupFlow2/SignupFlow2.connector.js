import { connect } from 'react-redux'
import { signup, getUserSettings, updateUserSettings, saveUserSettings } from '../SignupFlow.store.js'

export function mapStateToProps (state, props) {
  const { avatarUrl } = getUserSettings(state)
  return {
    avatarUrl,
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    changeSetting: setting => value => dispatch(updateUserSettings({[setting]: value})),
    saveUserSettings: settings => dispatch(saveUserSettings(settings))
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const goToNext = () => ownProps.navigation.navigate('SignupFlow3')
  const { avatarUrl } = stateProps
  const saveAndNext = () => {
    dispatchProps.saveUserSettings({avatarUrl})
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
