export default function findCommentById (comments, commentId) {
  for (let i = 0; i < comments.length; i++) {
    const comment = comments[i]

    if (comment.id === commentId) {
      return comment
    }

    if (comment.subComments) {
      const found = findCommentById(comment.subComments, commentId)
      if (found) {
        return found
      }
    }
  }

  return null
}
