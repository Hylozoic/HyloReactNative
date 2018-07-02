import { connect } from 'react-redux'

import fetchPost from '../../store/actions/fetchPost'
import { createComment } from './CommentEditor/CommentEditor.store'
import { getPresentedPost } from '../../store/selectors/getPost'
import getCurrentCommunityId from '../../store/selectors/getCurrentCommunityId'
import getMe from '../../store/selectors/getMe'
import makeGoToCommunity from '../../store/actions/makeGoToCommunity'

function getPostId (state, props) {
  return props.navigation.state.params.id
}

export function mapStateToProps (state, props) {
  const id = getPostId(state, props)
  console.log('postId', id)
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
    showTopic: topicName => props.navigation.navigate({routeName: 'Feed', params: {topicName}, key: 'Feed'}),
    createComment: value => dispatch(createComment(id, value)),
    goToCommunity: makeGoToCommunity(dispatch, props.navigation)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
