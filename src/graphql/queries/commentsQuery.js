import commentFieldsFragment from 'graphql/fragments/commentFieldsFragment'

export default `
query CommentsQuery (
  $id: ID,
  $cursor: ID
) {
  post(id: $id) {
    id
    comments(first: 10, cursor: $cursor, order: "desc") {
      items {
        ${commentFieldsFragment}
        childComments {
          items {
            ${commentFieldsFragment}
            post {
              id
            }
          }
          total
          hasMore
        }
      }
      total
      hasMore
    }
  }
}
`
