import { connect } from 'react-redux'
import { ALL_COMMUNITIES_ID } from '../../store/models/Community'

import fetchPost from '../../store/actions/fetchPost'
import { createComment } from './CommentEditor/CommentEditor.store'
import { getPresentedPost } from '../../store/selectors/getPost'
import getCurrentCommunityId from '../../store/selectors/getCurrentCommunityId'
import getMe from '../../store/selectors/getMe'
import makeGoToCommunity from '../../store/actions/makeGoToCommunity'
import { isEmpty } from 'lodash/fp'

function getPostId (state, props) {
  return props.navigation.state.params.id
}

export function mapStateToProps (state, props) {
  const id = getPostId(state, props)
  const currentUser = getMe(state, props)
  const communityId = getCurrentCommunityId(state, props)
  return {
    post: getPresentedPost(state, {id, communityId}),
    currentUser
  }
}

export function mapDispatchToProps (dispatch, props) {
  const id = getPostId(null, props)

  return {
    fetchPost: () => dispatch(fetchPost(id)),
    editPost: () => props.navigation.navigate({routeName: 'PostEditor', params: {id}, key: 'PostEditor'}),
    showMember: id => props.navigation.navigate({routeName: 'MemberProfile', params: {id}, key: 'MemberProfile'}),
    showTopic: (topicName, communityId) => {
      // All Communities and Network feed to topic nav
      // currently not supported
      if (communityId === ALL_COMMUNITIES_ID || isEmpty(communityId)) {
        props.navigation.navigate({routeName: 'TopicSupportComingSoon', key: 'TopicSupportComingSoon'})
      } else {
        props.navigation.navigate({routeName: 'Feed', params: {communityId, topicName}, key: 'Feed'})
      }
    },
    createComment: value => dispatch(createComment(id, value)),
    goToCommunity: makeGoToCommunity(dispatch, props.navigation)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
