import { connect } from 'react-redux'

import fetchPost, { FETCH_POST } from '../../store/actions/fetchPost'
import { getCommentEdits } from './CommentEditor/CommentEditor.store'
import { getPresentedPost } from '../../store/selectors/getPost'
import getCurrentCommunityId from '../../store/selectors/getCurrentCommunityId'
import getMe from '../../store/selectors/getMe'
import makeGoToCommunity from '../../store/actions/makeGoToCommunity'

function getPostId (state, props) {
  return props.navigation.state.params.id
}

export function mapStateToProps (state, props) {
  const id = getPostId(state, props)
  const currentUser = getMe(state, props)
  const commentEdit = getCommentEdits(state, {postId: id})
  const communityId = getCurrentCommunityId(state, props)

  return {
    post: getPresentedPost(state, {id, communityId}),
    currentUser,
    commentEdit
  }
}

export function mapDispatchToProps (dispatch, props) {
  const id = getPostId(null, props)

  return {
    fetchPost: () => dispatch(fetchPost(id)),
    editPost: () => props.navigation.navigate({routeName: 'PostEditor', params: {id}, key: 'PostEditor'}),
    showMember: id => props.navigation.navigate({routeName: 'MemberProfile', params: {id}, key: 'MemberProfile'}),
    showTopic: topicName => props.navigation.navigate({routeName: 'Feed', params: {topicName}, key: 'Feed'}),
    newComment: communityId => {
      return props.navigation.navigate('CommentEditor', {
        postId: id,
        communityId
      })
    },
    goToCommunity: makeGoToCommunity(dispatch, props.navigation)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
