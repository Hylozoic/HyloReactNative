import { connect } from 'react-redux'
import fetchPost, { FETCH_POST } from '../../store/actions/fetchPost'
import getPost from '../../store/selectors/getPost'

function getPostId (state, props) {
  return props.navigation.state.params.id
}

function mapStateToProps (state, props) {
  const id = getPostId(state, props)
  const post = getPost(state, {id})
  const pending = !!state.pending[FETCH_POST]

  return {
    post,
    pending
  }
}

function mapDispatchToProps (dispatch, props) {
  const id = getPostId(null, props)

  return {
    fetchPost: () => dispatch(fetchPost(id)),
    editPost: () => props.navigation.navigate('PostEditor', {id})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
