import { get } from 'lodash/fp'
import { FETCH_COMMENTS } from '../../components/Comments/Comments.store'
export const FETCH_POST = `FETCH_POST`

export function getPostFieldsFragment (withComments = true) {
  return `
  id
  title
  details
  detailsText
  type
  location
  announcement
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
  ${withComments ? `comments(first: 10, order: "desc") {
    items {
      id
      text
      creator {
        id
        name
        avatarUrl
      }
      createdAt
    }
    total
    hasMore
  }` : ''}
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
  attachments {
    id
    position
    type
    url
  }
  postMemberships {
    id
    pinned
    community {
      id
    }
  }
  topics {
    id
    name
    postsTotal
    followersTotal
  }`
}

export default function fetchPost (id, opts = {}) {
  return {
    type: FETCH_POST,
    graphql: {
      query: `query ($id: ID) {
        post(id: $id) {
          ${getPostFieldsFragment(true)}
        }
      }`,
      variables: {
        id
      }
    },
    meta: {
      afterInteractions: true,
      extractModel: 'Post',
      extractQueryResults: {
        getItems: get('payload.data.post.comments'),
        getType: () => FETCH_COMMENTS
      }
    }
  }
}
