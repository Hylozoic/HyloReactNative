import { get } from 'lodash/fp'
import { divToP } from 'hylo-utils/text'
import { getPostFieldsFragment } from '../../store/actions/fetchPost'

export const MODULE_NAME = 'PostEditor'
export const CREATE_POST = `${MODULE_NAME}/CREATE_POST`

export const UPDATE_POST = `${MODULE_NAME}/UPDATE_POST`
export const UPDATE_POST_PENDING = `${UPDATE_POST}_PENDING`

export const FETCH_DETAILS_AND_MEMBERS = `${MODULE_NAME}/FETCH_DETAILS_AND_MEMBERS`

export const MAX_TITLE_LENGTH = 100

export function createPost (post) {
  const {
    type,
    title,
    details,
    communities,
    imageUrls = [],
    fileUrls = [],
    topicNames = [],
    memberIds = [],
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
        $memberIds: [ID]        
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
          memberIds: $memberIds
        }) {
          ${getPostFieldsFragment(false)}
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
        topicNames,
        memberIds
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
    topicNames = [],
    memberIds = []
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
        $memberIds: [ID]        
      ) {
        updatePost(id: $id, data: {
          type: $type
          title: $title
          details: $details
          communityIds: $communityIds
          imageUrls: $imageUrls
          fileUrls: $fileUrls
          topicNames: $topicNames
          memberIds: $memberIds
        }) {
          ${getPostFieldsFragment(true)}
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
        topicNames,
        memberIds
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

export function fetchPostDetailsAndMembers (id) {
  return {
    type: FETCH_DETAILS_AND_MEMBERS,
    graphql: {
      query: `query ($id: ID) {
        post(id: $id) {
          id
          detailsText
          members {
            total
            hasMore
            items {
              id
              name
              avatarUrl
            }
          }
        }
      }`,
      variables: {
        id
      }
    },
    meta: {
      extractModel: 'Post'
    }
  }
}

export default function reducer (state = {}, action) {
  switch (action.type) {
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
