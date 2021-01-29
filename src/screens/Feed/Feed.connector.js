import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { isEmpty } from 'lodash/fp'
import getMe from 'store/selectors/getMe'
import getNetwork from 'store/selectors/getNetwork'
import getCommunity from 'store/selectors/getCommunity'
import getCurrentCommunityId from 'store/selectors/getCurrentCommunityId'
import getCurrentNetworkId from 'store/selectors/getCurrentNetworkId'
import makeGoToCommunity from 'store/actions/makeGoToCommunity'
import {
  fetchCommunityTopic,
  getCommunityTopic,
  setTopicSubscribe
} from './Feed.store'
import selectCommunity from 'store/actions/selectCommunity'
import selectNetwork from 'store/actions/selectNetwork'
import getMemberships from 'store/selectors/getMemberships'
import getRouteParam from 'store/selectors/getRouteParam'
import { showToast } from 'util/toast'

export function setupNetwork (state, props) {
  const networkId = getRouteParam('networkId', props.route)
    || getCurrentNetworkId(state, props)

  if (!networkId) return null

  const networkSlug = getRouteParam('networkSlug', props.route)
  const network = getNetwork(state, networkSlug
    ? { slug: networkSlug }
    : { id: networkId }
  )

  return network
}

export function setupCommunity (state, props) {
  const communityId = getRouteParam('communityId', props.route)
    || getCurrentCommunityId(state, props)
  const communitySlugFromLink = getRouteParam('communitySlugFromLink', props.route)
  const community = getCommunity(state, communitySlugFromLink
    ? { slug: communitySlugFromLink }
    : { id: communityId }
  )?.ref

  return community
}

export function setupTopicProps (state, props, { community }) {
  const topicName = props.topicName
    || getRouteParam('topicName', props.route)

  if (!topicName) return {}

  const communityTopic = getCommunityTopic(state, { topicName, slug: community.slug })
  const topic = communityTopic?.topic?.ref
  const topicSubscribed = communityTopic?.isSubscribed
  const topicPostsTotal = communityTopic?.postsTotal
  const topicFollowersTotal = communityTopic?.followersTotal

  return {
    topic,
    topicName,
    topicSubscribed,
    topicPostsTotal,
    topicFollowersTotal
  }
}

// The fundamental logic reflect here:
// * If there is a Network, there is not Community nor Topic
// * If there is a Network and a Community the Network is preferred
export function mapStateToProps (state, props) {
  const stateProps = {}

  stateProps.currentUser = getMe(state)
  stateProps.currentUserHasMemberships = !isEmpty(getMemberships(state))  
  stateProps.network = setupNetwork(state, props, stateProps)

  if (stateProps.network) return stateProps

  stateProps.community = setupCommunity(state, props, stateProps)

  return {
    ...stateProps,
    ...setupTopicProps(state, props, stateProps)
  }
}

export function mapDispatchToProps (dispatch, { navigation }) {
  return {
    newPost: (communityId, topicName) =>
      navigation.navigate('Edit Post', { communityId, topicName }),
    newProject: (communityId) =>
      navigation.navigate('Edit Post', { communityId, isProject: true }),
    showPost: id => navigation.navigate('Post Details', { id }),
    showMember: id => navigation.navigate('Member', { id }),
    goToCommunity: makeGoToCommunity(),
    goToCreateCommunity: () => navigation.navigate('Create Community'),
    ...bindActionCreators({
      fetchCommunityTopic,
      setTopicSubscribe,
      selectCommunity,
      selectNetwork
    }, dispatch)
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { community, network, topic, topicName, topicSubscribed } = stateProps
  const { navigation } = ownProps
  const communityId = community?.id
  const slug = community?.slug
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    newPost: () => dispatchProps.newPost(communityId, topicName),
    showTopic: selectedTopicName => {
      if (selectedTopicName == topicName) return
      if (network) {
        return showToast('Topics support for "All Communities" and Networks coming soon!')
      }
      if (topicName) {
        navigation.setParams({ topicName: selectedTopicName })
      } else {
        navigation.push('Topic Feed', { communityId, topicName: selectedTopicName })
      }
    },
    fetchCommunityTopic: topicName && slug
      ? () => dispatchProps.fetchCommunityTopic(topicName, slug)
      : () => {},
    setTopicSubscribe: topic && communityId
      ? () => dispatchProps.setTopicSubscribe(topic.id, communityId, !topicSubscribed)
      : () => {}
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
