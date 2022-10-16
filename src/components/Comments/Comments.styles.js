import { caribbeanGreen } from 'style/colors'

export const subCommentIndentation = {
  marginLeft: 40
}

export default {
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loading: {
    marginBottom: 15
  },
  showMore: {
    marginLeft: 12,
    marginRight: 12,
    marginBottom: 20,
    fontSize: 13,
    color: caribbeanGreen
  },
  subComment: {
    ...subCommentIndentation
  },
  subCommentsShowMore: {
    ...subCommentIndentation
  }
}
