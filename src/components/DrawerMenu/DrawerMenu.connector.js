import { connect } from 'react-redux'
import { get } from 'lodash/fp'
import getMe from '../../store/selectors/getMe'
import getMemberships from '../../store/selectors/getMemberships'
import { logout } from '../Login/actions'
import changeCommunity from '../../store/actions/changeCommunity'

export function mapStateToProps (state, props) {
  const currentUser = getMe(state)
  return {
    currentUser,
    name: get('name', currentUser) || 'you',
    avatarUrl: get('avatarUrl', currentUser),
    memberships: getMemberships(state)
  }
}

export const mapDispatchToProps = {
  logout,
  changeCommunity
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { currentUser, name } = stateProps
  const { navigation } = ownProps
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    selectCommunity: community => {
      dispatchProps.changeCommunity(community.id)
      navigation.navigate('DrawerClose')
    },
    showSettings: () => {
      navigation.navigate('UserSettings', {name})
    },
    goToMyProfile: () => {
      navigation.navigate('MemberProfile', {id: currentUser.id})
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
