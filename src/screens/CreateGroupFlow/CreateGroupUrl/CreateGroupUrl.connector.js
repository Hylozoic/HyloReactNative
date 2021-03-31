import { connect } from 'react-redux'
import {
  updateGroupData,
  FETCH_URL_EXISTS,
  fetchGroupExists,
  getGroupUrlExists,
  getGroupData
} from '../CreateGroupFlow.store'

export function mapStateToProps (state, props) {
  const urlExists = getGroupUrlExists(state)
  const groupData = getGroupData(state)
  const fetchUrlPending = state.pending[FETCH_URL_EXISTS]
  return {
    urlExists,
    groupData,
    fetchUrlPending
  }
}

export const mapDispatchToProps = {
  fetchGroupExists,
  updateGroupData
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
