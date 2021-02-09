import { connect } from 'react-redux'
import { get, omit, values, each } from 'lodash/fp'
import { pullAllBy } from 'lodash'
import getCurrentNetwork from 'store/selectors/getCurrentNetwork'
import getMe from 'store/selectors/getMe'
import getMemberships from 'store/selectors/getMemberships'
import getCurrentgroupId from 'store/selectors/getCurrentgroupId'
import getCurrentNetworkId from 'store/selectors/getCurrentNetworkId'
import { logout } from 'screens/Login/actions'
import selectGroup from 'store/actions/selectGroup'
import selectNetwork from 'store/actions/selectNetwork'
import { ALL_COMMUNITIES_NETWORK } from 'store/models/Network'
import getCanModerate from 'store/selectors/getCanModerate'
import getCurrentGroup from 'store/selectors/getCurrentGroup'
import { createSelector } from 'reselect'

export function partitionGroups (memberships) {
  const allGroups = memberships.map(m => ({
    ...m.group.ref,
    network: m.group.network && {
      ...get('network.ref', m.group),
      groups: get('network.groups', m.group) && get('network.groups', m.group).toRefArray()
    },
    newPostCount: m.newPostCount
  }))

  const reduced = allGroups.reduce((acc, group) => {
    if (group.network) {
      if (acc[group.network.id]) {
        acc[group.network.id].groups = acc[group.network.id].groups.concat([group])
        return acc
      } else {
        acc[group.network.id] = {
          ...group.network,
          groups: [group],
          // add all network groups here, some will be removed a few lines down
          nonMemberGroups: group.network.groups
        }
        return acc
      }
    } else {
      acc.independent = acc.independent.concat([group])
      return acc
    }
  }, {
    independent: []
  })

  const networks = [
    ALL_COMMUNITIES_NETWORK
  ].concat(values(omit('independent', reduced)))

  // pulls out the groups we are already a member of from the nonMemberGroups array
  each(n => {
    pullAllBy(n.nonMemberGroups, n.groups, 'id')
  })(networks)

  return {
    networks,
    groups: reduced.independent
  }
}

const getPartitionGroups = createSelector(
  getMemberships,
  (memberships) => partitionGroups(memberships)
)

export function mapStateToProps (state, props) {
  const { networks, groups } = getPartitionGroups(state)

  const currentContext = getCurrentNetwork(state) || getCurrentGroup(state)
  const currentNetworkId = getCurrentNetworkId(state, props)

  const currentUser = getMe(state)
  return {
    currentUser: getMe(state),
    name: get('name', currentUser) || 'you',
    avatarUrl: get('avatarUrl', currentUser),
    networks,
    groups,
    currentContext,
    canModerateCurrentGroup: !currentNetworkId && getCanModerate(state),
    currentGroupId: getCurrentgroupId(state, props),
    currentGroup: getCurrentGroup(state),
    currentNetworkId
  }
}

export const mapDispatchToProps = {
  logout,
  selectGroup,
  selectNetwork
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { currentUser, name, canModerateCurrentGroup } = stateProps
  const { navigation } = ownProps

  const goToGroupSettingsMenu = () => {
    navigation.navigate('Group Settings')
  }

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    goToGroup: group => {
      navigation.closeDrawer()
      navigation.navigate('Feed', {
        groupId: group.id,
        networkId: null
      })
      dispatchProps.selectGroup(group.id)
    },
    goToNetwork: network => {
      navigation.closeDrawer()
      navigation.navigate('Feed', {
        groupId: null,
        networkId: network.id
      })
      dispatchProps.selectNetwork(network.id)
    },
    showSettings: () => {
      navigation.navigate('Edit Account Info')
    },
    goToMyProfile: () => {
      navigation.navigate('Members', { screen: 'Member', params: { id: currentUser.id } })
    },
    goToCreateGroup: () => {
      navigation.navigate('Create Group')
    },
    goToGroupSettingsMenu: canModerateCurrentGroup && goToGroupSettingsMenu
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
