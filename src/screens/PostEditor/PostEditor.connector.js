import { connect } from 'react-redux'
import { get, isEmpty } from 'lodash/fp'
import { getPresentedPost } from 'store/selectors/getPost'
import isPendingFor from 'store/selectors/isPendingFor'
import getCanModerate from 'store/selectors/getCanModerate'
import getCurrentGroup from 'store/selectors/getCurrentGroup'
import getMe from 'store/selectors/getMe'
import upload from 'store/actions/upload'
import fetchPost from 'store/actions/fetchPost'
import { createTopicTag } from 'components/InlineEditor/InlineEditor'
import {
  createPost,
  createProject,
  updatePost,
  MAX_TITLE_LENGTH
} from './PostEditor.store'

function getPostId (state, props) {
  return props.route.params.id
}

export function mapStateToProps (state, props) {
  const currentGroup = get('ref', getCurrentGroup(state))
  const currentUser = getMe(state, props)
  const groupOptions = props.groupOptions ||
    (currentUser && currentUser.memberships.toModelArray().map(m => m.group.ref))
  const postId = getPostId(state, props)
  const post = getPresentedPost(state, { id: postId })
  // Setup new post with defaults from routing
  const selectedTopicName = get('route.params.topicName', props)
  const selectedTopicTag = createTopicTag({ name: selectedTopicName })
  const providedType = get('route.params.type', props)
  const defaultPost = selectedTopicName
    ? {
        details: selectedTopicTag + ' ',
        groups: currentGroup && [currentGroup]
      }
    : {
        groups: currentGroup && [currentGroup]
      }
  if (providedType) defaultPost.type = providedType

  return {
    post: post || defaultPost,
    groupOptions,
    imageUrls: post ? post.imageUrls : [],
    fileUrls: post ? post.fileUrls : [],
    isNewPost: isEmpty(postId),
    canModerate: getCanModerate(state),
    pendingDetailsText: isPendingFor(fetchPost, state)
  }
}

export function mapDispatchToProps (dispatch, props) {
  const { navigation } = props
  const postId = getPostId(null, props)

  return {
    save: postData => {
      if (!postData.title) {
        return Promise.reject(new Error('Title cannot be blank'))
      }

      if (postData.title.length >= MAX_TITLE_LENGTH) {
        return Promise.reject(new Error(`Title cannot be more than ${MAX_TITLE_LENGTH} characters`))
      }

      if (isEmpty(postData.groups)) {
        return Promise.reject(new Error('You must select a group'))
      }

      if (postId) postData.id = postId

      const saveAction = postId
        ? updatePost
        : postData.type === 'project'
          ? createProject
          : createPost

      return dispatch(saveAction(postData))
        .then(({ meta, error, payload }) => {
          if (error) {
            // TODO: handle API errors more appropriately
            throw new Error('Error submitting post')
          }
          const id = meta.extractModel?.getRoot(payload?.data)?.id

          navigation.navigate('Post Details', { id })

          return Promise.resolve({})
        })
    },
    upload: (type, id, file) => dispatch(upload(type, id, file)),
    fetchPost: () => dispatch(fetchPost(postId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
