import { connect } from 'react-redux'
import {
  createPost, FETCH_DETAILS_TEXT,
  fetchPostDetailsText,
  updatePost, MAX_TITLE_COUNT
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
  return {
    post: post || defaultPost,
    canModerate: getCanModerate(state),
    communityIds: post
      ? post.communities.map(x => x.id)
      : [communityId],
    imageUrls: post ? post.imageUrls : [],
    fileUrls: post ? post.fileUrls : [],
    isNewPost: isEmpty(postId),
    pendingDetailsText: state.pending[FETCH_DETAILS_TEXT]
  }
}

export function mapDispatchToProps (dispatch, props) {
  const { navigation } = props
  const postId = getPostId(null, props)
  const saveAction = postId ? updatePost : createPost

  return {
    save: postData => {
      if (!postData.title) {
        return Promise.reject(new Error('Title cannot be blank'))
      }

      if (postData.title.length >= MAX_TITLE_COUNT) {
        return Promise.reject(new Error(`Title cannot be more than ${MAX_TITLE_COUNT} characters`))
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
    fetchDetailsText: () => dispatch(fetchPostDetailsText(postId))
  }
}

export default connect(
  mapWhenFocused(mapStateToProps),
  mapWhenFocused(mapDispatchToProps)
)
