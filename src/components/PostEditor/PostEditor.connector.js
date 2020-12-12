import { connect } from 'react-redux'
import { get, isEmpty } from 'lodash/fp'
import { mapWhenFocused } from 'navigation/util/redux'
import { getPresentedPost } from '../../store/selectors/getPost'
import isPendingFor from '../../store/selectors/isPendingFor'
import getCanModerate from '../../store/selectors/getCanModerate'
import getCurrentCommunity from '../../store/selectors/getCurrentCommunity'
import getMe from '../../store/selectors/getMe'
import upload from '../../store/actions/upload'
import fetchPost from '../../store/actions/fetchPost'
import { pollingFindOrCreateLocation } from '../../store/actions/findOrCreateLocation'
import { createTopicTag } from '../InlineEditor/InlineEditor'
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
  const currentCommunity = get('ref', getCurrentCommunity(state))
  const currentUser = getMe(state, props)
  const communityOptions = props.communityOptions ||
    (currentUser && currentUser.memberships.toModelArray().map(m => m.community.ref))
  const selectedTopicName = get('route.params.topicName', props)
  const selectedTopicTag = createTopicTag({ name: selectedTopicName })
  const defaultPost = selectedTopicName
    ? {
        detailsText: selectedTopicTag + ' ',
        communities: [currentCommunity]
      } : {
        communities: [currentCommunity]
      }
  const postId = getPostId(state, props)
  const post = getPresentedPost(state, { id: postId })
  const isProject = get('route.params.isProject', props) ||
    get('type', post) === 'project'

  return {
    post: post || defaultPost,
    communityOptions,
    imageUrls: post ? post.imageUrls : [],
    fileUrls: post ? post.fileUrls : [],
    isNewPost: isEmpty(postId),
    isProject,
    canModerate: getCanModerate(state),
    pendingDetailsText: isPendingFor(fetchPost, state)
  }
}

export function mapDispatchToProps (dispatch, props) {
  const { navigation, isProject } = props
  const postId = getPostId(null, props)
  const saveAction = postId
    ? updatePost
    : isProject ? createProject : createPost

  return {
    save: postData => {
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

      return dispatch(saveAction(postData))
        .then(({ error, payload }) => {
          if (error) {
            // TODO: handle API errors more appropriately
            throw new Error('Error submitting post')
          }
          navigation.goBack()
          return Promise.resolve({})
        })
    },
    upload: (type, id, file) => dispatch(upload(type, id, file)),
    fetchPost: () => dispatch(fetchPost(postId)),
    pollingFindOrCreateLocation: (locationData, callback) => pollingFindOrCreateLocation(dispatch, locationData, callback)
  }
}

export default connect(
  mapWhenFocused(mapStateToProps),
  mapWhenFocused(mapDispatchToProps)
)
