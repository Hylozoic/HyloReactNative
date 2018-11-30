import { connect } from 'react-redux'
import {
  createPost, createProject, FETCH_DETAILS_AND_MEMBERS,
  fetchPostDetailsAndMembers,
  updatePost, MAX_TITLE_LENGTH
} from './PostEditor.store'
import { createTopicTag } from '../Editor/Editor'
import { get, isEmpty } from 'lodash/fp'
import { getPresentedPost } from '../../store/selectors/getPost'
import getCanModerate from '../../store/selectors/getCanModerate'
import { mapWhenFocused } from 'util/connector'
import upload from 'store/actions/upload'

function getPostId (state, props) {
  return props.navigation.state.params.id
}

export function mapStateToProps (state, props) {
  const communityId = get('navigation.state.params.communityId', props)
  const selectedTopicName = get('navigation.state.params.topicName', props)
  const selectedTopicTag = createTopicTag({name: selectedTopicName})
  const defaultPost = selectedTopicName
    ? {detailsText: selectedTopicTag, communityIds: [communityId]}
    : {}
  const postId = getPostId(state, props)
  const post = getPresentedPost(state, {id: postId})
  const isProject = get('navigation.state.params.isProject', props) ||
    get('type', post) === 'project'

  const shouldShowTypeChooser = !isProject

  return {
    post: post || defaultPost,
    canModerate: getCanModerate(state),
    communityIds: post
      ? post.communities.map(x => x.id)
      : [communityId],
    imageUrls: post ? post.imageUrls : [],
    fileUrls: post ? post.fileUrls : [],
    isNewPost: isEmpty(postId),
    isProject,
    pendingDetailsText: state.pending[FETCH_DETAILS_AND_MEMBERS],
    shouldShowTypeChooser
  }
}

export function mapDispatchToProps (dispatch, props) {
  const postId = getPostId(null, props)

  return {
    updatePost: postData => dispatch(updatePost(postData)),
    createProject: postData => dispatch(createProject(postData)),
    createPost: postData => dispatch(createPost(postData)),
    upload: (type, id, file) => dispatch(upload(type, id, file)),
    fetchDetailsAndMembers: () => dispatch(fetchPostDetailsAndMembers(postId))
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { navigation } = ownProps
  const { postId, isProject } = stateProps

  const saveAction = postId
    ? dispatchProps.updatePost
    : isProject ? dispatchProps.createProject : dispatchProps.createPost

  const save = postData => {
    if (!postData.title) {
      return Promise.reject(new Error('Title cannot be blank'))
    }

    if (postData.title.length >= MAX_TITLE_LENGTH) {
      return Promise.reject(new Error(`Title cannot be more than ${MAX_TITLE_LENGTH} characters`))
    }

    if (isEmpty(postData.communities)) {
      return Promise.reject(new Error('You must select a community'))
    }

    if (postId) postData.id = postId

    return saveAction(postData)
      .then(({ error, payload }) => {
        if (error) {
          // TODO: handle API errors more appropriately
          throw new Error('Error submitting post')
        }
        navigation.goBack()
        return Promise.resolve({})
      })
  }

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    save
  }
}

export default connect(
  mapWhenFocused(mapStateToProps),
  mapWhenFocused(mapDispatchToProps),
  mergeProps
)
