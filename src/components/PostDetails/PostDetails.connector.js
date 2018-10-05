import { connect } from 'react-redux'
import { ALL_COMMUNITIES_ID } from '../../store/models/Community'
import fetchPost from '../../store/actions/fetchPost'
import { createComment } from './CommentEditor/CommentEditor.store'
import { getPresentedPost } from '../../store/selectors/getPost'
import getCurrentCommunityId from '../../store/selectors/getCurrentCommunityId'
import getNavigationParam from '../../store/selectors/getNavigationParam'
import getMe from '../../store/selectors/getMe'
import makeGoToCommunity from '../../store/actions/makeGoToCommunity'
import joinProject from '../../store/actions/joinProject'
import leaveProject from '../../store/actions/leaveProject'
import { isNull, isUndefined, get } from 'lodash/fp'

function getPostId (state, props) {
  return getNavigationParam('id', state, props)
}

export function mapStateToProps (state, props) {
  const id = getPostId(state, props)
  const currentUser = getMe(state, props)
  const communityId = getCurrentCommunityId(state, props)
  const post = getPresentedPost(state, {id, communityId})
  const isProject = get('type', post) === 'project'
  return {
    post,
    isProject,
    currentUser
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { post, navigation } = stateProps
  const { dispatch } = dispatchProps
  const { navigation: { navigate } } = ownProps
  const id = getPostId(null, stateProps)
  // const { id, members } = post

  return {
    fetchPost: () => dispatch(fetchPost(id)),
    createComment: value => dispatch(createComment(id, value)),
    joinProject: () => dispatch(joinProject(id)),
    leaveProject: () => dispatch(leaveProject(id)),
    goToCommunity: makeGoToCommunity(dispatch, navigation),
    editPost: () => navigate({routeName: 'PostEditor', params: {id}, key: 'PostEditor'}),
    goToMembers: () => navigate({routeName: 'ProjectMembers', params: {id, members: get('members', post)}, key: 'ProjectMembers'}),
    showMember: userId => navigate({routeName: 'MemberProfile', params: {userId}, key: 'MemberProfile'}),
    showTopic: (topicName, communityId) => {
      // All Communities and Network feed to topic nav
      // currently not supported
      if (communityId === ALL_COMMUNITIES_ID || (isNull(communityId) || isUndefined(communityId))) {
        return navigate({routeName: 'TopicSupportComingSoon', key: 'TopicSupportComingSoon'})
      } else {
        return navigate({routeName: 'Feed', params: {communityId, topicName}, key: 'Feed'})
      }
    },
    ...ownProps,
    ...stateProps,
    ...dispatchProps
  }
}

export default connect(mapStateToProps, null, mergeProps)
