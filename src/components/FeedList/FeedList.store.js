export const MODULE_NAME = 'FeedList'

export const SET_FILTER = `${MODULE_NAME}/SET_FILTER`
export const SET_SORT = `${MODULE_NAME}/SET_SORT`
export const FETCH_POSTS = `${MODULE_NAME}/FETCH_POSTS`

const defaultState = {
  filter: 'all',
  sortBy: 'updated'
}

export default function reducer (state = defaultState, action) {
  const { error, type, payload } = action
  if (error) return state

  switch (type) {
    case SET_FILTER:
      return {
        ...state,
        filter: payload
      }
    case SET_SORT:
      return {
        ...state,
        sortBy: payload
      }
    default:
      return state
  }
}

export function setFilter (filter) {
  return {
    type: SET_FILTER,
    payload: filter
  }
}

export function setSort (sortBy) {
  return {
    type: SET_SORT,
    payload: sortBy
  }
}

export function getFilter (state) {
  return state[MODULE_NAME].filter
}

export function getSort (state) {
  return state[MODULE_NAME].sortBy
}

export const ALL_COMMUNITIES_ID = 'all-communities'

export function fetchPosts ({ subject, id, sortBy, offset, search, filter, topic }) {
  var query, extractModel

  if (subject === 'community') {
    query = communityQuery
    extractModel = 'Community'
  } else if (subject === 'all-communities') {
    query = allCommunitiesQuery
    id = ALL_COMMUNITIES_ID // this is just for queryResults, not the API
    extractModel = 'Post'
  } else {
    throw new Error(`FETCH_POSTS with subject=${subject} is not implemented`)
  }

  return {
    type: FETCH_POSTS,
    graphql: {
      query,
      variables: {
        id,
        sortBy,
        offset,
        search,
        filter,
        first: 20,
        topic
      }
    },
    meta: {extractModel}
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
  $id: String,
  $sortBy: String,
  $offset: Int,
  $search: String,
  $filter: String,
  $topic: Int,
  $first: Int
) {
  community(slug: $id) {
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
