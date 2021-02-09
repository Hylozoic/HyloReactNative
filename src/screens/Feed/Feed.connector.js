import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { isEmpty } from 'lodash/fp'
import getMe from 'store/selectors/getMe'
import getGroup from 'store/selectors/getGroup'
import getCurrentGroupId from 'store/selectors/getCurrentGroupId'
import makeGoToGroup from 'store/actions/makeGoToGroup'
import {
  fetchGroupTopic,
  getGroupTopic,
  setTopicSubscribe
} from './Feed.store'
import selectGroup from 'store/actions/selectGroup'
import getMemberships from 'store/selectors/getMemberships'
import getRouteParam from 'store/selectors/getRouteParam'
import { showToast } from 'util/toast'

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

export function mapStateToProps (state, props) {
  const stateProps = {}
  stateProps.currentUser = getMe(state)
  stateProps.currentUserHasMemberships = !isEmpty(getMemberships(state))  
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
    }, dispatch)
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { group, topic, topicName, topicSubscribed } = stateProps
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
      //   return showToast('Topics support for "All Groups" and Networks coming soon!')
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
