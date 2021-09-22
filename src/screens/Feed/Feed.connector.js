import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { isEmpty } from 'lodash/fp'
import getMe from 'store/selectors/getMe'
import makeGoToGroup from 'store/actions/makeGoToGroup'
import {
  fetchGroupTopic,
  getGroupTopic,
  setTopicSubscribe
} from './Feed.store'
import selectGroup from 'store/actions/selectGroup'
import getMemberships from 'store/selectors/getMemberships'
import getRouteParam from 'store/selectors/getRouteParam'
import getCurrentGroup from 'store/selectors/getCurrentGroup'

export function setupTopicProps (state, props, group) {
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

export function mapStateToProps (state, props) {
  const currentUser = getMe(state)
  const memberships = getMemberships(state)
  const currentUserHasMemberships = !isEmpty(memberships)  
  const group = getCurrentGroup(state)

  return {
    currentUser,
    currentUserHasMemberships,
    group,
    memberships,
    ...setupTopicProps(state, props, group)
  }
}

export function mapDispatchToProps (dispatch, { navigation }) {
  return {
    newPost: (groupId, topicName) =>
      navigation.navigate('Edit Post', { groupId, topicName }),
    newProject: (groupId) =>
      navigation.navigate('Edit Post', { groupId, type: 'project' }),
    showPost: id => navigation.navigate('Post Details', { id }),
    showMember: id => navigation.navigate('Member', { id }),
    goToGroup: makeGoToGroup(navigation, dispatch),
    goToCreateGroup: () => navigation.navigate('Create Group'),
    ...bindActionCreators({
      fetchGroupTopic,
      setTopicSubscribe,
      selectGroup,
    }, dispatch)
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { group, memberships, topic, topicName, topicSubscribed } = stateProps
  const { navigation } = ownProps
  const groupId = group?.id
  const slug = group?.slug
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    newPost: () => dispatchProps.newPost(groupId, topicName),
    goToGroup: groupId => dispatchProps.goToGroup(groupId, memberships, group.id),
    showTopic: selectedTopicName => {
      if (selectedTopicName == topicName) return
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
