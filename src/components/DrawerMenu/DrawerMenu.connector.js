import { connect } from 'react-redux'
import { get, omit, values, each } from 'lodash/fp'
import { pullAllBy } from 'lodash'
import getCurrentNetwork from '../../store/selectors/getCurrentNetwork'
import getMe from '../../store/selectors/getMe'
import getMemberships from '../../store/selectors/getMemberships'
import getCurrentCommunityId from '../../store/selectors/getCurrentCommunityId'
import getCurrentNetworkId from '../../store/selectors/getCurrentNetworkId'
import { logout } from '../Login/actions'
import selectCommunity from '../../store/actions/selectCommunity'
import selectNetwork from '../../store/actions/selectNetwork'
import { ALL_COMMUNITIES_ID } from '../../store/models/Community'
import getCanModerate from '../../store/selectors/getCanModerate'
import getCurrentCommunity from '../../store/selectors/getCurrentCommunity'
import { createSelector } from 'reselect'

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

const getPartitionCommunities = createSelector(
  getMemberships,
  (memberships) => partitionCommunities(memberships)
)

export function mapStateToProps (state, props) {
  const { networks, communities } = getPartitionCommunities(state)

  const currentContext = getCurrentNetwork(state) || getCurrentCommunity(state)
  const currentNetworkId = getCurrentNetworkId(state, props)

  const currentUser = getMe(state)
  return {
    currentUser: getMe(state),
    name: get('name', currentUser) || 'you',
    avatarUrl: get('avatarUrl', currentUser),
    networks,
    communities,
    currentContext,
    canModerateCurrentCommunity: !currentNetworkId && getCanModerate(state),
    currentCommunityId: getCurrentCommunityId(state, props),
    currentCommunity: getCurrentCommunity(state),
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
    navigation.navigate('CommunitySettingsMenu')
  }

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    goToCommunity: community => {
      if (community.id === ALL_COMMUNITIES_ID) {
        navigation.navigate('Home')
      } else {
        navigation.closeDrawer()
        navigation.navigate('Home')
      }
      dispatchProps.selectCommunity(community.id)
    },
    goToNetwork: network => {
      navigation.closeDrawer()
      navigation.navigate('Home')
      dispatchProps.selectNetwork(network.id)
    },
    showSettings: () => {
      navigation.navigate('UserSettings', { name })
    },
    goToMyProfile: () => {
      navigation.navigate('MemberProfile', { id: currentUser.id })
    },
    goToCreateCommunityName: () => {
      navigation.navigate('CreateCommunityName')
    },
    goToCommunitySettingsMenu: canModerateCurrentCommunity && goToCommunitySettingsMenu
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
