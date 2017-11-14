import { getPostFieldsFragment } from './fetchPost'
import { get } from 'lodash/fp'

export const FETCH_POSTS = `FETCH_POSTS`

export default function fetchPosts (
  { subject, slug, networkSlug, sortBy, offset, search, filter, topic },
  { reset } = {}
) {
  var query, extractModel, getItems

  if (subject === 'community') {
    query = communityQuery
    extractModel = 'Community'
    getItems = get('payload.data.community.posts')
  } else if (subject === 'network') {
    query = networkQuery
    extractModel = 'Network'
    getItems = get('payload.data.network.posts')
  } else if (subject === 'all-communities') {
    query = allCommunitiesQuery
    extractModel = 'Post'
    getItems = get('payload.data.posts')
  } else {
    throw new Error(`FETCH_POSTS with subject=${subject} is not implemented`)
  }

  return {
    type: FETCH_POSTS,
    graphql: {
      query,
      variables: {
        slug,
        networkSlug,
        sortBy,
        offset,
        search,
        filter,
        first: 20,
        topic
      }
    },
    meta: {
      afterInteractions: true,
      extractModel,
      extractQueryResults: {
        getItems,
        reset
      }
    }
  }
}

export const postsQueryFragment = `
posts(
  first: $first,
  offset: $offset,
  sortBy: $sortBy,
  search: $search,
  filter: $filter,
  topic: $topic,
  order: "desc"
) {
  hasMore
  items {
    ${getPostFieldsFragment(false)}
  }
}`

const communityQuery = `query (
  $slug: String,
  $sortBy: String,
  $offset: Int,
  $search: String,
  $filter: String,
  $topic: ID,
  $first: Int
) {
  community(slug: $slug) {
    id
    slug
    name
    avatarUrl
    bannerUrl
    postCount
    ${postsQueryFragment}
  }
}`

const networkQuery = `query (
  $networkSlug: String,
  $sortBy: String,
  $offset: Int,
  $search: String,
  $filter: String,
  $topic: ID,
  $first: Int
) {
  network(slug: $networkSlug) {
    id
    ${postsQueryFragment}
  }
}`

const allCommunitiesQuery = `query (
  $sortBy: String,
  $offset: Int,
  $search: String,
  $filter: String,
  $topic: ID,
  $first: Int
) {
  ${postsQueryFragment}
}`
