import { connect } from 'react-redux'
import selectGroup from 'store/actions/selectGroup'
import {
  createGroup,
  clearNameAndUrlFromStore,
  CREATE_GROUP,
  getGroupName,
  getGroupUrl
} from '../CreateGroupFlow.store'

export function mapStateToProps (state, props) {
  const groupName = getGroupName(state)
  const groupUrl = getGroupUrl(state)
  const createGroupPending = state.pending[CREATE_GROUP]
  return {
    groupName,
    groupUrl,
    createGroupPending
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    createGroup: (name, slug) => dispatch(createGroup(name, slug)),
    clearNameAndUrlFromStore: () => dispatch(clearNameAndUrlFromStore()),
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
