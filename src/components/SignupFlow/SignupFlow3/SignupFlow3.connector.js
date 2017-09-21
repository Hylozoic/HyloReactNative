import { connect } from 'react-redux'
import { getUserSettings, updateLocalUserSettings, updateUserSettings } from '../SignupFlow.store.js'

export function mapStateToProps (state, props) {
  const { location } = getUserSettings(state)
  return {
    location
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    changeSetting: setting => value => dispatch(updateLocalUserSettings({[setting]: value})),
    updateUserSettings: settings => dispatch(updateUserSettings(settings))
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const goToNext = () => ownProps.navigation.navigate('SignupFlow4')
  const { avatarUrl } = stateProps
  const saveAndNext = () => {
    dispatchProps.updateUserSettings({avatarUrl})
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
