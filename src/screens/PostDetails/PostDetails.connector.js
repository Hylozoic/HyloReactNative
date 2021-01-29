import { connect } from 'react-redux'
import { get } from 'lodash/fp'
import { showToast } from 'util/toast'
import fetchPost from 'store/actions/fetchPost'
import { createComment } from './CommentEditor/CommentEditor.store'
import getCurrentCommunity from 'store/selectors/getCurrentCommunity'
import { getPresentedPost } from 'store/selectors/getPost'
import getRouteParam from 'store/selectors/getRouteParam'
import getMe from 'store/selectors/getMe'
import makeGoToCommunity from 'store/actions/makeGoToCommunity'
import joinProject from 'store/actions/joinProject'
import leaveProject from 'store/actions/leaveProject'
import goToMemberMaker from 'store/actions/goToMemberMaker'
import getCurrentNetwork from 'store/selectors/getCurrentNetwork'

export function mapStateToProps (state, props) {
  const id = getRouteParam('id', props.route)
  const currentUser = getMe(state, props)
  const currentNetwork = getCurrentNetwork(state, props)
  const currentCommunity = getCurrentCommunity(state, props)
  const post = getPresentedPost(state, { id, currentCommunityId: currentCommunity?.id })
  const isProject = get('type', post) === 'project'
  return {
    id,
    post,
    isProject,
    currentUser,
    currentCommunity,
    currentNetwork
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { id, post, currentNetwork } = stateProps
  const { dispatch } = dispatchProps
  const { navigation } = ownProps

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    fetchPost: () => dispatch(fetchPost(id)),
    createComment: value => dispatch(createComment(id, value)),
    joinProject: () => dispatch(joinProject(id)),
    leaveProject: () => dispatch(leaveProject(id)),
    goToCommunity: makeGoToCommunity(),
    editPost: () => navigation.navigate('Edit Post', { id }),
    goToMembers: () => navigation.navigate('Project Members', { id, members: get('members', post) }),
    showMember: goToMemberMaker(navigation),
    showTopic: (topicName) => {
      if (currentNetwork) {
        return showToast('Topics support for "All Communities" and Networks coming soon!')
      } else {
        return navigation.navigate('Topic Feed', { topicName })
      }
    }
  }
}

export default connect(mapStateToProps, null, mergeProps, { forwardRef: true })
