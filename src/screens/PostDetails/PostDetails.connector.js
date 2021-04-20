import { connect } from 'react-redux'
import { get } from 'lodash/fp'
import { showToast } from 'util/toast'
import fetchPost from 'store/actions/fetchPost'
import createComment from 'store/actions/createComment'
import getCurrentGroup from 'store/selectors/getCurrentGroup'
import { getPresentedPost } from 'store/selectors/getPost'
import getRouteParam from 'store/selectors/getRouteParam'
import getMe from 'store/selectors/getMe'
import makeGoToGroup from 'store/actions/makeGoToGroup'
import joinProject from 'store/actions/joinProject'
import leaveProject from 'store/actions/leaveProject'
import goToMemberMaker from 'store/actions/goToMemberMaker'
import getMemberships from 'store/selectors/getMemberships'
import respondToEvent from 'store/actions/respondToEvent'

export function mapStateToProps (state, props) {
  const id = getRouteParam('id', props.route)
  const currentUser = getMe(state, props)
  const currentGroup = getCurrentGroup(state, props)
  const post = getPresentedPost(state, { id, currentGroupId: currentGroup?.id })
  const isProject = get('type', post) === 'project'
  const memberships = getMemberships(state)
  return {
    id,
    post,
    isProject,
    currentUser,
    currentGroup,
    memberships
  }
}

export function mapDispatchToProps (dispatch) {
  return { dispatch }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { id, post, currentGroup, memberships  } = stateProps
  const { dispatch } = dispatchProps
  const { navigation } = ownProps

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    fetchPost: () => dispatch(fetchPost(id)),
    createComment: params => dispatch(createComment({ ...params, postId: id })),
    joinProject: () => dispatch(joinProject(id)),
    leaveProject: () => dispatch(leaveProject(id)),
    goToGroup: groupId => makeGoToGroup(dispatch)(groupId, memberships, currentGroup.id),
    editPost: () => navigation.navigate('Edit Post', { id }),
    goToMembers: () => navigation.navigate('Project Members', { id, members: get('members', post) }),
    showMember: goToMemberMaker(navigation),
    showTopic: topicName => navigation.navigate('Topic Feed', { topicName }),
    respondToEvent: response => dispatch(respondToEvent(id, response))
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps, { forwardRef: true })
