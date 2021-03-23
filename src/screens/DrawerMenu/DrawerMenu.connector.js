import { connect } from 'react-redux'
import { get } from 'lodash/fp'
import getMe from 'store/selectors/getMe'
import getMemberships from 'store/selectors/getMemberships'
import getCurrentGroupId from 'store/selectors/getCurrentGroupId'
import { logout } from 'screens/Login/actions'
import selectGroup from 'store/actions/selectGroup'
import { PUBLIC_GROUP, ALL_GROUP } from 'store/models/Group'
import getCanModerate from 'store/selectors/getCanModerate'
import getCurrentGroup from 'store/selectors/getCurrentGroup'

export function mapStateToProps (state, props) {
  const memberships = getMemberships(state)
  const topGroups = [
    PUBLIC_GROUP,
    ALL_GROUP
  ]
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
      navigation.navigate('Group Navigation', {
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
