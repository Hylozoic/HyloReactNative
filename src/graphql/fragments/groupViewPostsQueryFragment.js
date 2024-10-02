import postFieldsFragment from 'graphql/fragments/postFieldsFragment'

// viewPosts shows all the aggregate posts from current group and any
// children the current user is a member of. We alias as posts so
// redux-orm sets up the relationship between group and posts correctly
const groupViewPostsQueryFragment = (includeChildGroupPosts = true) => `
${includeChildGroupPosts ? 'posts: viewPosts(' : 'posts('}
  activePostsOnly: $activePostsOnly,
  afterTime: $afterTime,
  beforeTime: $beforeTime,
  boundingBox: $boundingBox,
  collectionToFilterOut: $collectionToFilterOut,
  filter: $filter,
  first: $first,
  forCollection: $forCollection,
  isFulfilled: $isFulfilled,
  offset: $offset,
  order: $order,
  sortBy: $sortBy,
  search: $search,
  topic: $topic,
  topics: $topics,
  types: $types
) {
  __typename
  hasMore
  total
  items {
    __typename
    ${postFieldsFragment()}
  }
}`

export default groupViewPostsQueryFragment
