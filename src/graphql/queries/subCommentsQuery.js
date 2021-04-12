import commentFieldsFrament from 'graphql/fragments/commentFieldsFragment'

export default `
query subCommentsQuery (
  $commentId: ID,
  $cursor: ID
) {
  comment(id: $commentId) {
    id
    childComments(first: 10, cursor: $cursor, order: "desc") {
      items {
        ${commentFieldsFrament}
        post {
          id
        }
      }
      total
      hasMore
    }
  }
}
`