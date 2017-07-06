import { createSelector as ormCreateSelector } from 'reselect'
import orm from '../../store/models'

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

export default getPost
