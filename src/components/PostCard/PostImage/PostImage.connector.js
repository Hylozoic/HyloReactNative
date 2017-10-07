import { connect } from 'react-redux'
import getPost from '../../../store/selectors/getPost'

export function mapStateToProps (state, props) {
  const post = getPost(state, {id: props.postId, unfiltered: true})
  if (!post) return {}

  const image = post.attachments
  .filter(a => a.type === 'image' && a.position === 0)
  .first()
  if (!image) return {}

  return {imageUrl: image.url}
}

export default connect(mapStateToProps)
