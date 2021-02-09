import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { isEmpty } from 'lodash/fp'
import getMe from 'store/selectors/getMe'
import getNetwork from 'store/selectors/getNetwork'
import getGroup from 'store/selectors/getGroup'
import getCurrentGroupId from 'store/selectors/getCurrentGroupId'
import getCurrentNetworkId from 'store/selectors/getCurrentNetworkId'
import makeGoToGroup from 'store/actions/makeGoToGroup'
import {
  fetchGroupTopic,
  getGroupTopic,
  setTopicSubscribe
} from './Feed.store'
import selectGroup from 'store/actions/selectGroup'
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

export function setupGroup (state, props) {
  const groupId = getRouteParam('groupId', props.route)
    || getCurrentGroupId(state, props)
  const groupSlugFromLink = getRouteParam('groupSlugFromLink', props.route)
  const group = getGroup(state, groupSlugFromLink
    ? { slug: groupSlugFromLink }
    : { id: groupId }
  )?.ref

  return group
}

export function setupTopicProps (state, props, { group }) {
  const topicName = props.topicName
    || getRouteParam('topicName', props.route)

  if (!topicName) return {}

  const groupTopic = getGroupTopic(state, { topicName, slug: group.slug })
  const topic = groupTopic?.topic?.ref
  const topicSubscribed = groupTopic?.isSubscribed
  const topicPostsTotal = groupTopic?.postsTotal
  const topicFollowersTotal = groupTopic?.followersTotal

  return {
    topic,
    topicName,
    topicSubscribed,
    topicPostsTotal,
    topicFollowersTotal
  }
}

// The fundamental logic reflect here:
// * If there is a Network, there is not Group nor Topic
// * If there is a Network and a Group the Network is preferred
export function mapStateToProps (state, props) {
  const stateProps = {}
  stateProps.currentUser = getMe(state)
  stateProps.currentUserHasMemberships = !isEmpty(getMemberships(state))  
  stateProps.network = setupNetwork(state, props, stateProps)

  if (stateProps.network) return stateProps

  stateProps.group = setupGroup(state, props, stateProps)

  return {
    ...stateProps,
    ...setupTopicProps(state, props, stateProps)
  }
}

export function mapDispatchToProps (dispatch, { navigation }) {
  return {
    newPost: (groupId, topicName) =>
      navigation.navigate('Edit Post', { groupId, topicName }),
    newProject: (groupId) =>
      navigation.navigate('Edit Post', { groupId, isProject: true }),
    showPost: id => navigation.navigate('Post Details', { id }),
    showMember: id => navigation.navigate('Member', { id }),
    goToGroup: makeGoToGroup(),
    goToCreateGroup: () => navigation.navigate('Create Group'),
    ...bindActionCreators({
      fetchGroupTopic,
      setTopicSubscribe,
      selectGroup,
      selectNetwork
    }, dispatch)
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { group, network, topic, topicName, topicSubscribed } = stateProps
  const { navigation } = ownProps
  const groupId = group?.id
  const slug = group?.slug
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    newPost: () => dispatchProps.newPost(groupId, topicName),
    showTopic: selectedTopicName => {
      if (selectedTopicName == topicName) return
      if (network) {
        return showToast('Topics support for "All Groups" and Networks coming soon!')
      }
      if (topicName) {
        navigation.setParams({ topicName: selectedTopicName })
      } else {
        navigation.push('Topic Feed', { groupId, topicName: selectedTopicName })
      }
    },
    fetchGroupTopic: topicName && slug
      ? () => dispatchProps.fetchGroupTopic(topicName, slug)
      : () => {},
    setTopicSubscribe: topic && groupId
      ? () => dispatchProps.setTopicSubscribe(topic.id, groupId, !topicSubscribed)
      : () => {}
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
