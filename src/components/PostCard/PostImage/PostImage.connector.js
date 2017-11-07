import { connect } from 'react-redux'
import getPost from '../../../store/selectors/getPost'
import { get } from 'lodash/fp'

export function mapStateToProps (state, props) {
  const post = getPost(state, {id: props.postId})
  if (!post) return {}

  const imageUrls = post.images()
  .orderBy(get('position'))
  .toRefArray()
  .map(get('url'))

  return {imageUrls}
}

export default connect(mapStateToProps)
