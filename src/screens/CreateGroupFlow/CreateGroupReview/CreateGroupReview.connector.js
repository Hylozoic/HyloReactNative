import { connect } from 'react-redux'
import {
  createGroup,
  clearCreateGroupStore,
  getGroupData,
  CREATE_GROUP
} from '../CreateGroupFlow.store'

export function mapStateToProps (state, props) {
  return {
    groupData: getGroupData(state),
    createGroupPending: state.pending[CREATE_GROUP]
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    createGroup: groupData => dispatch(createGroup(groupData)),
    clearCreateGroupStore: () => dispatch(clearCreateGroupStore()),
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { navigation } = ownProps
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    goToCreateGroupName: () => {
      navigation.navigate('CreateGroupName')
    },
    goToCreateGroupUrl: () => {
      navigation.navigate('CreateGroupUrl')
    },
    goToGroup: group => {
      navigation.closeDrawer()
      navigation.navigate('Feed', { groupId: group?.id })
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
