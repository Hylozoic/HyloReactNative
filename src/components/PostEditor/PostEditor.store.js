import { get } from 'lodash/fp'

export const MODULE_NAME = 'PostEditor'
export const CREATE_POST = `${MODULE_NAME}/CREATE_POST`
export const UPDATE_POST = `${MODULE_NAME}/UPDATE_POST`
export const SET_DETAILS = `${MODULE_NAME}/SET_DETAILS`
export const CLEAR_DETAILS = `${MODULE_NAME}/CLEAR_DETAILS`

export function createPost (post) {
  const { type, title, details, communities } = post
  const communityIds = communities.map(c => c.id)
  return {
    type: CREATE_POST,
    graphql: {
      query: `mutation ($type: String, $title: String, $details: String, $communityIds: [String]) {
        createPost(data: {type: $type, title: $title, details: $details, communityIds: $communityIds}) {
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
        }
      }`,
      variables: {
        type,
        title,
        details,
        communityIds
      }
    },
    meta: {extractModel: 'Post'}
  }
}

export function updatePost (post) {
  const { id, type, title, details, communities } = post
  const communityIds = communities.map(c => c.id)
  return {
    type: UPDATE_POST,
    graphql: {
      query: `mutation ($id: ID, $type: String, $title: String, $details: String, $communityIds: [String]) {
        updatePost(id: $id, data: {type: $type, title: $title, details: $details, communityIds: $communityIds}) {
          id
          type
          title
          details
          communities {
            id
            name
            slug
          }
        }
      }`,
      variables: {
        id,
        type,
        title,
        details,
        communityIds
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
