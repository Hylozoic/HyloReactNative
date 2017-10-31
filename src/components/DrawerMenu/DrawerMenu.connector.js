import { connect } from 'react-redux'
import { get, omit, values } from 'lodash/fp'
import getMe from '../../store/selectors/getMe'
import getMemberships from '../../store/selectors/getMemberships'
import getCurrentCommunityId from '../../store/selectors/getCurrentCommunityId'
import { logout } from '../Login/actions'
import changeCommunity from '../../store/actions/changeCommunity'
import { ALL_COMMUNITIES_ID } from '../../store/models/Community'

export function partitionCommunities (memberships) {
  const allCommunities = memberships.map(m => ({
    ...m.community.ref,
    network: get('network.ref', m.community),
    newPostCount: m.newPostCount
  }))

  return allCommunities.reduce((acc, community) => {
    if (community.network) {
      if (acc[community.network.id]) {
        acc[community.network.id].communities = acc[community.network.id].communities.concat([community])
        return acc
      } else {
        acc[community.network.id] = {
          ...community.network,
          communities: [community]
        }
        return acc
      }
    } else {
      acc['independent'] = acc['independent'].concat([community])
      return acc
    }
  }, {
    independent: []
  })
}

export function mapStateToProps (state, props) {
  const currentUser = getMe(state)
  const currentCommunityId = getCurrentCommunityId(state, props)
  const paritionedCommunities =
    partitionCommunities(getMemberships(state))
  const networks = [
    {
      id: ALL_COMMUNITIES_ID,
      name: 'All Communities',
      communities: []
    }
  ].concat(values(omit('independent', paritionedCommunities)))

  const communities = paritionedCommunities.independent

  return {
    currentUser,
    name: get('name', currentUser) || 'you',
    avatarUrl: get('avatarUrl', currentUser),
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
      if (community.id === ALL_COMMUNITIES_ID &&
        ownProps.screenProps.currentTabName !== 'Home') {
        navigation.navigate('Home')
      } else {
        navigation.navigate('DrawerClose')
      }
      dispatchProps.changeCommunity(community.id)
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
