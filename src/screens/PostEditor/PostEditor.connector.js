import { connect } from 'react-redux'
import { get, isEmpty } from 'lodash/fp'
import { bindActionCreators } from 'redux'
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
  updatePost
} from './PostEditor.store'
import getRouteParam from 'store/selectors/getRouteParam'
import { pollingFindOrCreateLocation as providedPollingFindOrCreateLocation } from 'screens/LocationPicker/LocationPicker.store'

export function mapStateToProps (state, props) {
  const currentGroup = get('ref', getCurrentGroup(state))
  const currentUser = getMe(state, props)
  const groupOptions = props.groupOptions ||
    (currentUser && currentUser.memberships.toModelArray().map(m => m.group.ref))
  const postId = getRouteParam('id', props?.route)
  const post = getPresentedPost(state, { id: postId })
  // Setup new post with defaults from routing
  const selectedTopicName = get('route.params.topicName', props)
  const selectedTopicTag = createTopicTag({ name: selectedTopicName })
  const providedType = get('route.params.type', props)
  const providedLat = getRouteParam('lat', props?.route)
  const providedLng = getRouteParam('lng', props?.route)
  const providedLocationObject = providedLat && {
    center: {
      lat: parseFloat(providedLat),
      lng: parseFloat(providedLng)
    },
    fullText: `${providedLat}, ${providedLng}`
  }
  const defaultPost = selectedTopicName
    ? {
        details: selectedTopicTag + ' ',
        groups: currentGroup && [currentGroup],
        locationObject: providedLocationObject
      }
    : {
        groups: currentGroup && [currentGroup],
        locationObject: providedLocationObject
      }
  if (providedType) defaultPost.type = providedType

  return {
    post: post || defaultPost,
    groupOptions,
    canModerate: getCanModerate(state),
    pendingDetailsText: isPendingFor(fetchPost, state)
  }
}

export function mapDispatchToProps (dispatch) {
  return {
    pollingFindOrCreateLocation: (locationData, callback) => {
      return providedPollingFindOrCreateLocation(
        dispatch,
        locationData,
        locationObject => callback(locationObject)
      )
    },
    ...bindActionCreators({
      fetchPost,
      createPost,
      createProject,
      updatePost,
      upload
    }, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
