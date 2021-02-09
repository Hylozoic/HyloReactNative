import { connect } from 'react-redux'
import { get, omit, values, each } from 'lodash/fp'
import { pullAllBy } from 'lodash'
import getMe from 'store/selectors/getMe'
import getMemberships from 'store/selectors/getMemberships'
import getCurrentGroupId from 'store/selectors/getCurrentGroupId'
import { logout } from 'screens/Login/actions'
import selectGroup from 'store/actions/selectGroup'
import { ALL_GROUPS_GROUP } from 'store/models/Group'
import getCanModerate from 'store/selectors/getCanModerate'
import getCurrentGroup from 'store/selectors/getCurrentGroup'
import { createSelector } from 'reselect'

export function partitionGroups (memberships) {
  const allGroups = memberships.map(m => m.group.ref)

  const reduced = allGroups.reduce((acc, group) => {
    acc.independent = acc.independent.concat([group])
    return acc
  }, {
    independent: []
  })

  const networks = [
    ALL_GROUPS_GROUP
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
  const currentContext = getCurrentGroup(state)
  const currentUser = getMe(state)

  return {
    currentUser: getMe(state),
    name: get('name', currentUser) || 'you',
    avatarUrl: get('avatarUrl', currentUser),
    networks,
    groups,
    currentContext,
    canModerateCurrentGroup: getCanModerate(state),
    currentGroupId: getCurrentGroupId(state, props),
    currentGroup: getCurrentGroup(state)
  }
}

export const mapDispatchToProps = {
  logout,
  selectGroup
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
        groupId: group.id
      })
      dispatchProps.selectGroup(group.id)
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



// import orm from '../models'
// import { createSelector as ormCreateSelector } from 'redux-orm'
// import { get } from 'lodash/fp'
// import { ALL_GROUPS_ID } from 'store/models/Network'
// import { ALL_GROUPS_GROUP } from 'store/models/Network'

// // gets network from slug OR id
// const getNetwork = ormCreateSelector(
//   orm,
//   (_, props) => get('id', props),
//   (_, props) => get('slug', props),
//   (_, id, slug) => {
//     if (id === ALL_GROUPS_ID || slug === ALL_GROUPS_ID) {
//       return ALL_GROUPS_GROUP
//     }
//     return null
//   }
// )
// export default getNetwork
