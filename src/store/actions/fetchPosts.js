import { getPostFieldsFragment } from './fetchPost'
import { get } from 'lodash/fp'
import { ALL_GROUP_ID, PUBLIC_GROUP_ID } from 'store/models/Group'
import { FETCH_POSTS } from 'store/constants'
import postsQueryFragment from 'graphql/fragments/postsQueryFragment'
import publicPostsQueryFragment from 'graphql/fragments/publicPostsQueryFragment'

export default function fetchPosts ({ slug, sortBy, offset, search, filter, topic }) {
  var query, extractModel, getItems

  if (slug === ALL_GROUP_ID) {
    query = allGroupsQuery
    extractModel = 'Post'
    getItems = get('payload.data.posts')
  } else if (slug === PUBLIC_GROUP_ID) {
    query = publicPostsQuery
    extractModel = 'Post'
    getItems = get('payload.data.posts')
  } else {
    query = groupQuery
    extractModel = 'Group'
    getItems = get('payload.data.group.posts')
  }

  return {
    type: FETCH_POSTS,
    graphql: {
      query,
      variables: {
        slug,
        sortBy,
        offset,
        search,
        filter,
        first: 20,
        topic
      }
    },
    meta: {
      extractModel,
      extractQueryResults: {
        getItems
      }
    }
  }
}

const groupQuery = `query (
  $slug: String,
  $sortBy: String,
  $offset: Int,
  $search: String,
  $filter: String,
  $topic: ID,
  $first: Int,
  $boundingBox: [PointInput]
) {
  group(slug: $slug, updateLastViewed: true) {
    id
    slug
    name
    locationObject {
      center {
        lat
        lng
      }
    }
    avatarUrl
    bannerUrl
    postCount
    ${postsQueryFragment}
  }
}`

const allGroupsQuery = `query (
  $sortBy: String,
  $offset: Int,
  $search: String,
  $filter: String,
  $topic: ID,
  $first: Int
  $boundingBox: [PointInput]
) {
  ${postsQueryFragment}
}`

const publicPostsQuery = `query (
  $sortBy: String,
  $offset: Int,
  $search: String,
  $filter: String,
  $topic: ID,
  $first: Int,
  $boundingBox: [PointInput],
  $groupSlugs: [String]
) {
  ${publicPostsQueryFragment}
}`

// export default function fetchPosts (
//   { context, slug, sortBy, offset, search, filter, topic },
//   { reset } = {}
// ) {
//   let query, getItems, extractModel

//   if (slug === ALL_GROUP_ID) {
//     query = allGroupsQuery
//     getItems = get('payload.data.posts')
//   } else {
//     query = groupQuery
//     getItems = get('payload.data.group.posts')
//     extractModel = 'Post'
//   }

//   return {
//     type: FETCH_POSTS,
//     graphql: {
//       query,
//       variables: {
//         slug,
//         sortBy,
//         offset,
//         search,
//         filter,
//         first: 20,
//         topic
//       }
//     },
//     meta: {
//       afterInteractions: true,
//       extractModel,
//       extractQueryResults: {
//         getItems,
//         reset
//       }
//     }
//   }
// }

// export const postsQueryFragment = `
// posts(
//   first: $first,
//   offset: $offset,
//   sortBy: $sortBy,
//   search: $search,
//   filter: $filter,
//   topic: $topic,
//   order: "desc"
// ) {
//   hasMore
//   items {
//     ${getPostFieldsFragment(false)}
//   }
// }`

// const groupQuery = `query (
//   $slug: String,
//   $sortBy: String,
//   $offset: Int,
//   $search: String,
//   $filter: String,
//   $topic: ID,
//   $first: Int
// ) {
//   group(slug: $slug, updateLastViewed: true) {
//     id
//     slug
//     name
//     avatarUrl
//     bannerUrl
//     postCount
//     ${postsQueryFragment}
//   }
// }`

// const allGroupsQuery = `query (
//   $sortBy: String,
//   $offset: Int,
//   $search: String,
//   $filter: String,
//   $topic: ID,
//   $first: Int
// ) {
//   ${postsQueryFragment}
// }`
