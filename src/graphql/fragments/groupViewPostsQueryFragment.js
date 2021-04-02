import postFieldsFragment from 'graphql/fragments/postFieldsFragment'

// Change to showing aggregate tree of posts by doing
// posts: viewPosts(
const groupViewPostsQueryFragment = `
posts: viewPosts(
  boundingBox: $boundingBox,
  filter: $filter,
  first: $first,
  offset: $offset,
  order: "desc",
  sortBy: $sortBy,
  search: $search,
  topic: $topic
) {
  hasMore
  total
  items {
    ${postFieldsFragment(false)}
  }
}`

export default groupViewPostsQueryFragment
