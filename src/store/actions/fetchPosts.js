import { get } from 'lodash/fp'
import { FETCH_POSTS } from 'store/constants'
import postsQueryFragment from 'graphql/fragments/postsQueryFragment'
import groupViewPostsQueryFragment from 'graphql/fragments/groupViewPostsQueryFragment'

// NOTE: All of the below is currently tracking `hylo-evo/src/routes/Stream.store.js`
export default function fetchPosts ({ activePostsOnly, afterTime, beforeTime, collectionToFilterOut, context, filter, first, forCollection, offset, order, search, slug, sortBy, topic, topics, types }) {
  let query, extractModel, getItems

  if (context === 'groups') {
    query = groupQuery
    extractModel = 'Group'
    getItems = get('payload.data.group.posts')
  } else if (context === 'all' || context === 'public') {
    query = postsQuery
    extractModel = 'Post'
    getItems = get('payload.data.posts')
  } else {
    throw new Error(`FETCH_POSTS with context=${context} is not implemented`)
  }

  return {
    type: FETCH_POSTS,
    graphql: {
      query,
      variables: {
        activePostsOnly,
        afterTime,
        beforeTime,
        collectionToFilterOut,
        context,
        filter,
        first: first || 20,
        forCollection,
        offset,
        order,
        search,
        slug,
        sortBy,
        topic,
        topics,
        types
      }
    },
    meta: {
      afterInteractions: true,
      slug,
      extractModel,
      extractQueryResults: {
        getItems
      }
    }
  }
}

const groupQuery = `query GroupPostsQuery (
  $activePostsOnly: Boolean,
  $afterTime: Date,
  $beforeTime: Date,
  $boundingBox: [PointInput],
  $collectionToFilterOut: ID,
  $filter: String,
  $first: Int,
  $forCollection: ID,
  $isFulfilled: Boolean,
  $offset: Int,
  $order: String,
  $search: String,
  $slug: String,
  $sortBy: String,
  $topic: ID,
  $topics: [ID],
  $types: [String]
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
    ${groupViewPostsQueryFragment}
  }
}`

const postsQuery = `query PostsQuery (
  $activePostsOnly: Boolean,
  $afterTime: Date,
  $beforeTime: Date,
  $boundingBox: [PointInput],
  $collectionToFilterOut: ID,
  $context: String,
  $filter: String,
  $first: Int,
  $forCollection: ID,
  $groupSlugs: [String],
  $isFulfilled: Boolean,
  $offset: Int,
  $order: String,
  $search: String,
  $sortBy: String,
  $topic: ID,
  $topics: [ID],
  $types: [String]
) {
  ${postsQueryFragment}
}`
