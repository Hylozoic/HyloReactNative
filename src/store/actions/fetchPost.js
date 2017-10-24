import { get } from 'lodash/fp'
import { FETCH_COMMENTS } from '../../components/Comments/Comments.store'
export const FETCH_POST = `FETCH_POST`

export const getPostFieldsFragment = (withComments = true) => `
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
  }`

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
      extractModel: 'Post',
      extractQueryResults: {
        getItems: get('payload.data.post.comments'),
        getType: () => FETCH_COMMENTS
      }
    }
  }
}
