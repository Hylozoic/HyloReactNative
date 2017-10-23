import { connect } from 'react-redux'
import { get } from 'lodash/fp'
import getMe from '../../store/selectors/getMe'
import getMemberships from '../../store/selectors/getMemberships'
import getCurrentCommunityId from '../../store/selectors/getCurrentCommunityId'
import { logout } from '../Login/actions'
import changeCommunity from '../../store/actions/changeCommunity'

export function mapStateToProps (state, props) {
  const currentUser = getMe(state)
  const currentCommunityId = getCurrentCommunityId(state, props)

  const allCommunities = getMemberships(state).map(m => ({
    ...m.community.ref,
    newPostCount: m.newPostCount
  }))

  const networks = [
    {
      id: 'all',
      name: 'All Communities',
      communities: []
    },
    {
      id: 1,
      name: 'Good Network',
      avatarUrl: allCommunities[5].avatarUrl,
      communities: allCommunities.slice(0, 2)
    },
    {
      id: 2,
      name: 'Small Network',
      avatarUrl: allCommunities[4].avatarUrl,
      communities: allCommunities.slice(2, 3)
    }
  ]

  const communities = allCommunities.slice(3)

  return {
    currentUser,
    name: get('name', currentUser) || 'you',
    avatarUrl: get('avatarUrl', currentUser),
    cim: getMemberships(state),
    networks,
    communities,
    currentCommunityId
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
    goToCommunity: community => {
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
