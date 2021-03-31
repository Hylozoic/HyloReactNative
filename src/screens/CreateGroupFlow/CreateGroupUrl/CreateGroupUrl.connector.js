import { connect } from 'react-redux'
import {
  saveGroupUrl,
  FETCH_URL_EXISTS,
  fetchGroupExists,
  getGroupUrlExists
} from '../CreateGroupFlow.store'

export function mapStateToProps (state, props) {
  const urlExists = getGroupUrlExists(state)
  const groupUrl = state.CreateGroupFlow.groupUrl
  const fetchUrlPending = state.pending[FETCH_URL_EXISTS]
  return {
    urlExists,
    groupUrl,
    fetchUrlPending
  }
}

export const mapDispatchToProps = {
  fetchGroupExists,
  saveGroupUrl
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { navigation } = ownProps
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    goToNextStep: () => {
      navigation.navigate('CreateGroupVisibilityAccessibility')
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
