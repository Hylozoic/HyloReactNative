import { connect } from 'react-redux'
import { get, omit, values, each } from 'lodash/fp'
import { pullAllBy } from 'lodash'
import getMe from '../../store/selectors/getMe'
import getMemberships from '../../store/selectors/getMemberships'
import getCurrentCommunityId from '../../store/selectors/getCurrentCommunityId'
import getCurrentNetworkId from '../../store/selectors/getCurrentNetworkId'
import { logout } from '../Login/actions'
import selectCommunity from '../../store/actions/selectCommunity'
import selectNetwork from '../../store/actions/selectNetwork'
import { ALL_COMMUNITIES_ID } from '../../store/models/Community'
import getCommunity from '../../store/selectors/getCommunity'

export function partitionCommunities (memberships) {
  const allCommunities = memberships.map(m => ({
    ...m.community.ref,
    network: m.community.network && {
      ...get('network.ref', m.community),
      communities: get('network.communities', m.community) && get('network.communities', m.community).toRefArray()
    },
    newPostCount: m.newPostCount
  }))

  const reduced = allCommunities.reduce((acc, community) => {
    if (community.network) {
      if (acc[community.network.id]) {
        acc[community.network.id].communities = acc[community.network.id].communities.concat([community])
        return acc
      } else {
        acc[community.network.id] = {
          ...community.network,
          communities: [community],
          // add all network communities here, some will be removed a few lines down
          nonMemberCommunities: community.network.communities
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

  const networks = [
    {
      id: ALL_COMMUNITIES_ID,
      name: 'All Communities',
      communities: []
    }
  ].concat(values(omit('independent', reduced)))

  // pulls out the communities we are already a member of from the nonMemberCommunities array
  each(n => {
    pullAllBy(n.nonMemberCommunities, n.communities, 'id')
  })(networks)

  return {
    networks,
    communities: reduced.independent
  }
}

export function mapStateToProps (state, props) {
  const currentUser = getMe(state)
  const currentCommunityId = getCurrentCommunityId(state, props)
  const currentCommunity = currentCommunityId && getCommunity(state, {id: currentCommunityId})
  const canModerateCurrentCommunity = currentUser && currentUser.canModerate(currentCommunity)
  const currentNetworkId = getCurrentNetworkId(state, props)
  const { networks, communities } = partitionCommunities(getMemberships(state))

  return {
    currentUser,
    name: get('name', currentUser) || 'you',
    avatarUrl: get('avatarUrl', currentUser),
    networks,
    communities,
    canModerateCurrentCommunity,
    currentCommunityId,
    currentCommunity,
    currentNetworkId
  }
}

export const mapDispatchToProps = {
  logout,
  selectCommunity,
  selectNetwork
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { currentUser, name, canModerateCurrentCommunity } = stateProps
  const { navigation } = ownProps

  const goToCommunitySettingsMenu = () => {
    navigation.navigate({routeName: 'CommunitySettingsMenu', key: 'CommunitySettingsMenu'})
  }

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    goToCommunity: community => {
      if (community.id === ALL_COMMUNITIES_ID &&
        ownProps.screenProps.currentTabName !== 'Home') {
        navigation.navigate({routeName: 'Home', key: 'Home'})
      } else {
        navigation.navigate('DrawerClose')
        navigation.navigate({routeName: 'Home', key: 'Home'})
      }
      dispatchProps.selectCommunity(community.id)
    },
    goToNetwork: network => {
      navigation.navigate('DrawerClose')
      navigation.navigate({routeName: 'Home', key: 'Home'})
      dispatchProps.selectNetwork(network.id)
    },
    showSettings: () => {
      navigation.navigate({routeName: 'UserSettings', params: {name}, key: 'UserSettings'})
    },
    goToMyProfile: () => {
      navigation.navigate({routeName: 'MemberProfile', params: {id: currentUser.id}, key: 'MemberProfile'})
    },
    goToCreateCommunityName: () => {
      navigation.navigate({routeName: 'CreateCommunityName', key: 'CreateCommunityName'})
    },
    goToCommunitySettingsMenu: canModerateCurrentCommunity && goToCommunitySettingsMenu
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
