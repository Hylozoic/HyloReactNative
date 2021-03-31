import { connect } from 'react-redux'
import { updateGroupData, getGroupData } from '../CreateGroupFlow.store'

export function mapStateToProps (state, props) {
  return {
    groupData: getGroupData(state)
  }
}

export const mapDispatchToProps = {
  updateGroupData
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { navigation } = ownProps
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    goToNextStep: () => {
      navigation.navigate('CreateGroupUrl')
    },
    navigation
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
