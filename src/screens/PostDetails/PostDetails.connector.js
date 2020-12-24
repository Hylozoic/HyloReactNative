import { connect } from 'react-redux'
import { get } from 'lodash/fp'
import { showToast } from 'util/toast'
import { ALL_COMMUNITIES_ID } from 'routing/helpers'
import fetchPost from 'store/actions/fetchPost'
import { createComment } from './CommentEditor/CommentEditor.store'
import getCurrentCommunity from 'store/selectors/getCurrentCommunity'
import { getPresentedPost } from 'store/selectors/getPost'
import getCurrentCommunityId from 'store/selectors/getCurrentCommunityId'
import getRouteParam from 'store/selectors/getRouteParam'
import getMe from 'store/selectors/getMe'
import makeGoToCommunity from 'store/actions/makeGoToCommunity'
import joinProject from 'store/actions/joinProject'
import leaveProject from 'store/actions/leaveProject'
import goToMemberMaker from 'store/actions/goToMemberMaker'

export function mapStateToProps (state, props) {
  const id = getRouteParam('id', props.route)
  const currentUser = getMe(state, props)
  const currentCommunity = getCurrentCommunity(state, props)
  const currentCommunityId = getCurrentCommunity(state, props)
  const post = getPresentedPost(state, { id, currentCommunityId })
  const isProject = get('type', post) === 'project'
  return {
    id,
    post,
    isProject,
    currentUser,
    currentCommunityId,
    currentCommunity
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { id, post, currentCommunityId } = stateProps
  const { dispatch } = dispatchProps
  const { navigation, navigation: { navigate } } = ownProps

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    fetchPost: () => dispatch(fetchPost(id)),
    createComment: value => dispatch(createComment(id, value)),
    joinProject: () => dispatch(joinProject(id)),
    leaveProject: () => dispatch(leaveProject(id)),
    goToCommunity: makeGoToCommunity(dispatch, navigation),
    editPost: () => navigate('Edit Post', { id }),
    goToMembers: () => navigate('Project Members', { id, members: get('members', post) }),
    showMember: goToMemberMaker({ navigate }),
    showTopic: (topicName) => {
      if (!currentCommunityId || currentCommunityId === ALL_COMMUNITIES_ID) {
        return showToast('Topics support for "All Communities" and Networks coming soon!')
      } else {
        return navigate('Topic Feed', { topicName })
      }
    }
  }
}

export default connect(mapStateToProps, null, mergeProps, { forwardRef: true })
