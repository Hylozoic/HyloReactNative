import { connect } from 'react-redux'
import fetchPost, { FETCH_POST } from '../../store/actions/fetchPost'
import getMe from '../../store/selectors/getMe'
import { getCommentEdits } from './CommentEditor/CommentEditor.store'
import getPost from '../../store/selectors/getPost'
import { get } from 'lodash/fp'
import makeGoToCommunity from '../../store/actions/makeGoToCommunity'

function getPostId (state, props) {
  return props.navigation.state.params.id
}

function mapStateToProps (state, props) {
  const id = getPostId(state, props)
  const post = getPost(state, {id})
  const pending = !!state.pending[FETCH_POST]
  const currentUser = getMe(state, props)
  const commentEdit = getCommentEdits(state, {postId: id})

  return {
    post,
    pending,
    currentUser,
    commentEdit
  }
}

function mapDispatchToProps (dispatch, props) {
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
    goToCommunity: makeGoToCommunity(dispatch, props.navigate)
  }
}

function mergeProps (stateProps, dispatchProps, ownProps) {
  // TODO: handle posts in multiple communities
  const communityId = get('communities.0.id', stateProps.post)
  return {
    ...stateProps,
    ...dispatchProps,
    newComment: () => dispatchProps.newComment(communityId)
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
