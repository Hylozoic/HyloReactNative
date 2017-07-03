import { connect } from 'react-redux'
import { createSelector as ormCreateSelector } from 'reselect'
import orm from '../../store/models'
import fetchPost, { FETCH_POST } from '../../store/actions/fetchPost'
import getMe from '../../store/selectors/getMe'

const getPost = ormCreateSelector(
  state => state,
  state => orm.session(state.orm),
  (state, props) => props.id,
  (state, session, id) => {
    try {
      const post = session.Post.get({id})
      return {
        ...post.ref,
        creator: post.creator,
        commenters: post.commenters.toModelArray(),
        communities: post.communities.toModelArray()
      }
    } catch (e) {
      return null
    }
  }
)

function getPostId (state, props) {
  return props.navigation.state.params.id
}

function mapStateToProps (state, props) {
  const id = getPostId(state, props)
  const post = getPost(state, {id})
  const pending = !!state.pending[FETCH_POST]
  const currentUser = getMe(state, props)

  return {
    post,
    pending,
    newComment: () => console.log('newComment', id),
    currentUser
  }
}

function mapDispatchToProps (dispatch, props) {
  const id = getPostId(null, props)

  return {
    fetchPost: () => dispatch(fetchPost(id))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
