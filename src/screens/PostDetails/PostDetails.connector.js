import { connect } from 'react-redux'
import { ALL_COMMUNITIES_ID } from 'store/models/Community'
import fetchPost from 'store/actions/fetchPost'
import { createComment } from './CommentEditor/CommentEditor.store'
import { getPresentedPost } from 'store/selectors/getPost'
import getCurrentCommunityId from 'store/selectors/getCurrentCommunityId'
import getRouteParam from 'store/selectors/getRouteParam'
import getMe from 'store/selectors/getMe'
import makeGoToCommunity from 'store/actions/makeGoToCommunity'
import joinProject from 'store/actions/joinProject'
import leaveProject from 'store/actions/leaveProject'
import goToMemberMaker from 'store/actions/goToMemberMaker'
import { isNull, isUndefined, get } from 'lodash/fp'

function getPostId (state, props) {
  return getRouteParam('id', props.route)
}

export function mapStateToProps (state, props) {
  const id = getPostId(state, props)
  const currentUser = getMe(state, props)
  const communityId = getCurrentCommunityId(state, props)
  const post = getPresentedPost(state, { id, communityId })
  const isProject = get('type', post) === 'project'
  return {
    id,
    post,
    isProject,
    currentUser
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { id, post } = stateProps
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
    showTopic: (topicName, communityId) => {
      // All Communities and Network feed to topic nav
      // currently not supported
      if (communityId === ALL_COMMUNITIES_ID || (isNull(communityId) || isUndefined(communityId))) {
        return navigate('Topics')
      } else {
        return navigate('Feed', { communityId, topicName })
      }
    }
  }
}

export default connect(mapStateToProps, null, mergeProps, { forwardRef: true })
