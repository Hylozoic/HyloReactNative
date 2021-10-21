import { get } from 'lodash/fp'
import { isContextGroup } from 'store/models/Group'
import { FETCH_POSTS } from 'store/constants'
import postsQueryFragment from 'graphql/fragments/postsQueryFragment'
import groupViewPostsQueryFragment from 'graphql/fragments/groupViewPostsQueryFragment'

export default function fetchPosts ({ afterTime, beforeTime, context, filter, offset, order, search, slug, sortBy, topic }) {
  var query, extractModel, getItems

  if (isContextGroup(slug)) {
    query = postsQuery
    extractModel = 'Post'
    getItems = get('payload.data.posts')
    context = slug
  } else {
    query = groupQuery
    extractModel = 'Group'
    getItems = get('payload.data.group.posts')
    context = 'groups'
  }

  return {
    type: FETCH_POSTS,
    graphql: {
      query,
      variables: {
        afterTime,
        beforeTime,
        filter,
        first: 20,
        offset,
        context,
        order,
        search,
        slug,
        sortBy,
        topic
      }
    },
    meta: {
      slug,
      extractModel,
      extractQueryResults: {
        getItems
      }
    }
  }
}

const groupQuery = `query (
  $afterTime: Date,
  $beforeTime: Date,
  $boundingBox: [PointInput],
  $filter: String,
  $first: Int,
  $offset: Int,
  $order: String,
  $search: String,
  $slug: String,
  $sortBy: String,
  $topic: ID
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

const postsQuery = `query (
  $afterTime: Date,
  $beforeTime: Date,
  $boundingBox: [PointInput],
  $context: String,
  $filter: String,
  $first: Int,
  $groupSlugs: [String],
  $offset: Int,
  $order: String,
  $search: String,
  $sortBy: String,
  $topic: ID,
) {
  ${postsQueryFragment}
}`
