import { connect } from 'react-redux'
import { get } from 'lodash/fp'
import getMe from 'store/selectors/getMe'
import getMemberships from 'store/selectors/getMemberships'
import getCurrentGroupId from 'store/selectors/getCurrentGroupId'
import logout from 'store/actions/logout'
import selectGroup from 'store/actions/selectGroup'
import { PUBLIC_GROUP, ALL_GROUP } from 'store/models/Group'
import getCanModerate from 'store/selectors/getCanModerate'
import getCurrentGroup from 'store/selectors/getCurrentGroup'

export function mapStateToProps (state, props) {
  const topGroups = [
    PUBLIC_GROUP,
    ALL_GROUP
  ]
  const memberships = getMemberships(state)
  const myGroups = memberships
    .map(m => m.group.ref)
    .sort((a, b) => a.name.localeCompare(b.name))
  const currentUser = getMe(state)

  return {
    currentUser: getMe(state),
    name: get('name', currentUser) || 'you',
    avatarUrl: get('avatarUrl', currentUser),
    topGroups,
    myGroups,
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
  const { currentUser, canModerateCurrentGroup } = stateProps
  const { navigation } = ownProps

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    goToGroup: async group => {
      navigation.navigate('Feed', { groupId: group.id })
    },
    goToMyProfile: () => {
      navigation.navigate('Members', { screen: 'Member', params: { id: currentUser.id } })
    },
    goToCreateGroup: () => {
      navigation.navigate('Create Group', { screen: 'CreateGroupName', params: { reset: true } })
    },
    goToGroupSettings: () => canModerateCurrentGroup &&
      navigation.navigate('Group Settings'),
    goToInvitePeople: () => canModerateCurrentGroup &&
      navigation.navigate('Group Settings', { screen: 'Invite' })
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
