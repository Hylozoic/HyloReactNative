import { connect } from 'react-redux'
import { makeGetPresentedPost } from '../../../store/selectors/getPost'

const makeMapStateToProps = () => {
  const getPresentedPost = makeGetPresentedPost()

  const mapStateToProps = (state, props) => {
    return {
      post: getPresentedPost(state, {id: props.postId, communityId: props.communityId})
    }
  }
  return mapStateToProps
}

export default connect(makeMapStateToProps)
