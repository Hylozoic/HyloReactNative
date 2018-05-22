import { connect } from 'react-redux'
import getPost from '../../../store/selectors/getPost'
import { get } from 'lodash/fp'
import createCachedSelector from 're-reselect'

const getImageUrls = createCachedSelector(
  getPost,
  (post) => !post ? null : post.images()
    .orderBy(get('position'))
    .toRefArray()
    .map(get('url'))
)(
  (state, props) => props.id
)

const mapStateToProps = (state, props) => {
  return {
    imageUrls: getImageUrls(state, {id: props.postId})
  }
}

export default connect(mapStateToProps)
