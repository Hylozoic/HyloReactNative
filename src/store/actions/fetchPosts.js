import { ALL_COMMUNITIES_ID } from '../models/Community'
import { get } from 'lodash/fp'

export const FETCH_POSTS = `FETCH_POSTS`

export function fetchPosts ({ subject, slug, sortBy, offset, search, filter, topic }) {
  var query, extractModel, getItems

  if (subject === 'community') {
    query = communityQuery
    extractModel = 'Community'
    getItems = get('payload.data.community.posts')
  } else if (subject === 'all-communities') {
    query = allCommunitiesQuery
    slug = ALL_COMMUNITIES_ID // this is just for queryResults, not the API
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
    id
    title
    details
    type
    location
    creator {
      id
      name
      avatarUrl
      tagline
    }
    createdAt
    updatedAt
    commenters(first: 3) {
      id
      name
      avatarUrl
    }
    commentersTotal
    commentsTotal
    linkPreview {
      title
      url
      imageUrl
    }
    votesTotal
    myVote
    communities {
      id
      name
      slug
    }
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
