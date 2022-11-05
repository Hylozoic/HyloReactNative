import { connect } from 'react-redux'
import { get } from 'lodash/fp'
import { isModalScreen, modalScreenName } from 'navigation/linking/helpers'
import fetchPost from 'store/actions/fetchPost'
import getCurrentGroup from 'store/selectors/getCurrentGroup'
import { getPresentedPost } from 'store/selectors/getPost'
import getRouteParam from 'store/selectors/getRouteParam'
import getMe from 'store/selectors/getMe'
import joinProject from 'store/actions/joinProject'
import leaveProject from 'store/actions/leaveProject'
import respondToEvent from 'store/actions/respondToEvent'

export function mapStateToProps (state, props) {
  const currentUser = getMe(state, props)
  const currentGroup = getCurrentGroup(state, props)
  const postId = getRouteParam('id', props.route)
  const post = getPresentedPost(state, { postId, forGroupId: currentGroup?.id })
  const isProject = get('type', post) === 'project'

  return {
    postId,
    post,
    isProject,
    currentUser,
    currentGroup
  }
}

export function mapDispatchToProps (dispatch) {
  return { dispatch }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { postId, post } = stateProps
  const { dispatch } = dispatchProps
  const { navigation, route } = ownProps

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    fetchPost: () => dispatch(fetchPost(postId)),
    joinProject: () => dispatch(joinProject(postId)),
    leaveProject: () => dispatch(leaveProject(postId)),
    editPost: () => navigation.navigate('Edit Post', { id: postId }),
    goToMembers: () => navigation.navigate('Project Members', { id: postId, members: get('members', post) }),
    showMember: id => {
      if (isModalScreen(route.name)) {
        return navigation.navigate(modalScreenName('Member'), { id })
      } else {
        return navigation.navigate('Member', { id })
      }
    },
    showTopic: topicName => navigation.navigate('Feed', { topicName }),
    respondToEvent: response => dispatch(respondToEvent(postId, response))
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps, { forwardRef: true })
