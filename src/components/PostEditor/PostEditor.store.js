import { get } from 'lodash/fp'
import { divToP } from 'hylo-utils/text'

export const MODULE_NAME = 'PostEditor'
export const CREATE_POST = `${MODULE_NAME}/CREATE_POST`
export const UPDATE_POST = `${MODULE_NAME}/UPDATE_POST`
export const UPDATE_POST_PENDING = UPDATE_POST + '_PENDING'
export const SET_DETAILS = `${MODULE_NAME}/SET_DETAILS`
export const CLEAR_DETAILS = `${MODULE_NAME}/CLEAR_DETAILS`

export function createPost (post) {
  const {
    type,
    title,
    details,
    communities,
    imageUrls = [],
    fileUrls = [],
    topicNames = [],
    sendAnnouncement
  } = post
  const communityIds = communities.map(c => c.id)
  const preprocessedDetails = divToP(details)
  return {
    type: CREATE_POST,
    graphql: {
      query: `mutation (
        $type: String
        $title: String
        $details: String
        $communityIds: [String]
        $imageUrls: [String]
        $fileUrls: [String]
        $announcement: Boolean
        $topicNames: [String]
      ) {
        createPost(data: {
          type: $type
          title: $title
          details: $details
          communityIds: $communityIds
          imageUrls: $imageUrls
          fileUrls: $fileUrls
          announcement: $announcement
          topicNames: $topicNames
        }) {
          id
          type
          title
          details
          announcement
          commentersTotal
          updatedAt
          communities {
            id
            name
            slug
          }
          creator {
            id
          }
          attachments {
            id
            position
            type
            url
          }
          topics {
            id
            name
          }
        }
      }`,
      variables: {
        type,
        title,
        details: preprocessedDetails,
        communityIds,
        imageUrls,
        fileUrls,
        announcement: sendAnnouncement,
        topicNames
      }
    },
    meta: {extractModel: 'Post'}
  }
}

export function updatePost (post) {
  const {
    id,
    type,
    title,
    details,
    communities,
    imageUrls = [],
    fileUrls = [],
    topicNames = []
  } = post
  const communityIds = communities.map(c => c.id)
  const preprocessedDetails = divToP(details)
  return {
    type: UPDATE_POST,
    graphql: {
      query: `mutation ($id: ID
        $type: String
        $title: String
        $details: String
        $communityIds: [String]
        $imageUrls: [String]
        $fileUrls: [String]
        $topicNames: [String]
      ) {
        updatePost(id: $id, data: {
          type: $type
          title: $title
          details: $details
          communityIds: $communityIds
          imageUrls: $imageUrls
          fileUrls: $fileUrls
          topicNames: $topicNames
        }) {
          id
          type
          title
          details
          updatedAt
          announcement
          communities {
            id
            name
            slug
          }
          attachments {
            id
            position
            type
            url
          }
          topics {
            id
            name
          }
        }
      }`,
      variables: {
        id,
        type,
        title,
        details: preprocessedDetails,
        communityIds,
        imageUrls,
        fileUrls,
        topicNames
      }
    },
    meta: {
      extractModel: {
        modelName: 'Post',
        getRoot: get('updatePost'),
        append: false
      }
    }
  }
}

export function setDetails (details) {
  return {
    type: SET_DETAILS,
    payload: details
  }
}

export default function reducer (state = {}, action) {
  switch (action.type) {
    case SET_DETAILS:
      return {...state, details: action.payload}
  }
  return state
}

export function ormSessionReducer (session, action) {
  const { type, meta } = action
  if (type === UPDATE_POST_PENDING) {
    // deleting all attachments and topics here because we restore them from the result of the UPDATE_POST action
    const post = session.Post.withId(meta.graphql.variables.id)
    post.attachments.delete()
    post.update({topics: []})
  }
}
