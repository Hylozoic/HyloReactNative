import { connect } from 'react-redux'
import { getUserSettings, updateLocalUserSettings, updateUserSettings } from '../SignupFlow.store.js'

export function mapStateToProps (state, props) {
  const { location, locationId } = getUserSettings(state)
  return {
    location,
    locationId
  }
}

export function mapDispatchToProps (dispatch) {
  return {
    changeSetting: setting => value => dispatch(updateLocalUserSettings({ [setting]: value })),
    updateUserSettings: settings => dispatch(updateUserSettings(settings))
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { location } = stateProps

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    saveAndNext: () => {
      dispatchProps.updateUserSettings({ location })
        .then(({ error }) => {
          if (error) return
          return ownProps.navigation.navigate('SignupFlow4')
        })
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
