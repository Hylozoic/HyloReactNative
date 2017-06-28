import { connect } from 'react-redux'
import { createSelector as ormCreateSelector } from 'reselect'
import orm from '../../store/models'
import fetchPost from '../../store/actions/fetchPost'

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

function mapStateToProps (state, props) {
  const post = getPost(state, props)
  return {
    post
  }
}

function mapDispatchToProps (dispatch, props) {
  const { id } = props

  return {
    fetchPost: () => dispatch(fetchPost(id))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
