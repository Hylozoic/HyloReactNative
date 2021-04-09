import commentFieldsFrament from 'graphql/fragments/commentFieldsFragment'

export default `
query subCommentsQuery (
  $id: ID,
  $cursor: ID
) {
  comment(id: $id) {
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