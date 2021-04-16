import { connect } from 'react-redux'
import getCurrentGroup from 'store/selectors/getCurrentGroup'
import { getChildGroups, getParentGroups } from 'store/selectors/getGroupRelationships'
import getMyJoinRequests from 'store/selectors/getMyJoinRequests'
import getMemberships from 'store/selectors/getMemberships'
import selectGroup from 'store/actions/selectGroup'

export function mapStateToProps (state, props) {
  const group = getCurrentGroup(state, props)
  const queryProps = { groupSlug: group.slug }
  const memberships = getMemberships(state, props)
  const joinRequests = getMyJoinRequests(state, props)
  const childGroups = getChildGroups(state, queryProps).map(g => {
    g.memberStatus = memberships.find(m => m.group.id === g.id)
      ? 'member'
      : joinRequests.find(jr => jr.group.id === g.id)
        ? 'requested'
        : 'not'
    return g
  })
  const parentGroups = getParentGroups(state, queryProps).map(g => {
    g.memberStatus = memberships.find(m => m.group.id === g.id)
      ? 'member'
      : joinRequests.find(jr => jr.group.id === g.id)
        ? 'requested'
        : 'not'
    return g
  })

  return {
    group,
    memberships,
    childGroups,
    parentGroups
  }
}

export const mapDispatchToProps = {
  selectGroup
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { navigation } = ownProps

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    goToGroup: group => {
      navigation.navigate('Group Navigation', { groupId: group.id })
      dispatchProps.selectGroup(group.id)
    },
    goToGroupDetail: group => {
      navigation.navigate('Group Detail', { groupId: group.id })
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
