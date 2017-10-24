import { get } from 'lodash/fp'
import { divToP } from 'hylo-utils/text'

export const MODULE_NAME = 'PostEditor'
export const CREATE_POST = `${MODULE_NAME}/CREATE_POST`
export const UPDATE_POST = `${MODULE_NAME}/UPDATE_POST`
export const SET_DETAILS = `${MODULE_NAME}/SET_DETAILS`
export const CLEAR_DETAILS = `${MODULE_NAME}/CLEAR_DETAILS`

export function createPost (post) {
  const { type, title, details, communities, imageUrls = [] } = post
  const communityIds = communities.map(c => c.id)
  const preprocessedDetails = divToP(details)
  return {
    type: CREATE_POST,
    graphql: {
      query: `mutation (
        $type: String,
        $title: String,
        $details: String,
        $communityIds: [String],
        $imageUrls: [String]
      ) {
        createPost(data: {
          type: $type,
          title: $title,
          details: $details,
          communityIds: $communityIds,
          imageUrls: $imageUrls
        }) {
          id
          type
          title
          details
          commentersTotal
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
        }
      }`,
      variables: {
        type,
        title,
        details: preprocessedDetails,
        communityIds,
        imageUrls
      }
    },
    meta: {extractModel: 'Post'}
  }
}

export function updatePost (post) {
  const { id, type, title, details, communities, imageUrls = [] } = post
  const communityIds = communities.map(c => c.id)
  const preprocessedDetails = divToP(details)
  return {
    type: UPDATE_POST,
    graphql: {
      query: `mutation ($id: ID,
        $type: String,
        $title: String,
        $details: String,
        $communityIds: [String],
        $imageUrls: [String]
      ) {
        updatePost(id: $id, data: {
          type: $type,
          title: $title,
          details: $details,
          communityIds: $communityIds,
          imageUrls: $imageUrls
        }) {
          id
          type
          title
          details
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
        }
      }`,
      variables: {
        id,
        type,
        title,
        details: preprocessedDetails,
        communityIds,
        imageUrls
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

export default function reducer (state = {},
  action) {
  switch (action.type) {
    case SET_DETAILS:
      return {...state, details: action.payload}
  }
  return state
}
