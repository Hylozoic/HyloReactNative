import { connect } from 'react-redux'
import fetchPost from '../../store/actions/fetchPost'
import getMe from '../../store/selectors/getMe'
import { getCommentEdits } from './CommentEditor/CommentEditor.store'
import getPost from '../../store/selectors/getPost'
import { get } from 'lodash/fp'
import makeGoToCommunity from '../../store/actions/makeGoToCommunity'

function getPostId (state, props) {
  return props.navigation.state.params.id
}

export function mapStateToProps (state, props) {
  const id = getPostId(state, props)
  let post = getPost(state, {id})
  const currentUser = getMe(state, props)
  const commentEdit = getCommentEdits(state, {postId: id})

  return {
    post: {
      ...post.ref,
      creator: post.creator,
      commenters: post.commenters.toModelArray(),
      communities: post.communities.toModelArray(),
      fileUrls: post.getFileUrls()
    },
    currentUser,
    commentEdit
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

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
