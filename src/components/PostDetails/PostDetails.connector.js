import { connect } from 'react-redux'
import { get } from 'lodash/fp'

import fetchPost from '../../store/actions/fetchPost'
import { getCommentEdits } from './CommentEditor/CommentEditor.store'
import getPost, { presentPost } from '../../store/selectors/getPost'
import getCurrentCommunityId from '../../store/selectors/getCurrentCommunityId'
import getMe from '../../store/selectors/getMe'
import makeGoToCommunity from '../../store/actions/makeGoToCommunity'
import { mapWhenFocused, mergeWhenFocused } from 'util/connector'

function getPostId (state, props) {
  return props.navigation.state.params.id
}

export function mapStateToProps (state, props) {
  const id = getPostId(state, props)
  const currentUser = getMe(state, props)
  const commentEdit = getCommentEdits(state, {postId: id})
  const communityId = getCurrentCommunityId(state, props)
  let post = presentPost(getPost(state, {id}), communityId)

  return {
    post,
    currentUser,
    commentEdit,
    isFocused: props.isFocused
  }
}

export function mapDispatchToProps (dispatch, props) {
  const id = getPostId(null, props)

  return {
    fetchPost: () => dispatch(fetchPost(id)),
    editPost: () => props.navigation.navigate('PostEditor', {id}),
    showMember: id => props.navigation.navigate('MemberProfile', {id}),
    showTopic: topicName => props.navigation.navigate('Feed', {topicName}),
    newComment: communityId => {
      return props.navigation.navigate('CommentEditor', {
        postId: id,
        communityId
      })
    },
    goToCommunity: makeGoToCommunity(dispatch, props.navigation)
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  // TODO: handle posts in multiple communities
  const communityId = get('communities.0.id', stateProps.post)
  return {
    ...stateProps,
    ...dispatchProps,
    newComment: () => dispatchProps.newComment(communityId)
  }
}

export default connect(
  mapWhenFocused(mapStateToProps),
  mapWhenFocused(mapDispatchToProps),
  mergeWhenFocused(mergeProps)
)
