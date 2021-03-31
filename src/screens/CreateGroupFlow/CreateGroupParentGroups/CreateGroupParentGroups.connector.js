import { connect } from 'react-redux'
import { saveGroupName, getGroupName } from '../CreateGroupParentGroups.store'

export function mapStateToProps (state, props) {
  const groupName = getGroupName(state)
  return {
    groupName
  }
}

export const mapDispatchToProps = {
  saveGroupName
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { navigation } = ownProps
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    goToCreateGroupUrl: () => {
      navigation.navigate('CreateGroupUrl')
    },
    navigation
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
