import { createSelector as ormCreateSelector } from 'reselect'
import orm from '../../store/models'

const getPost = ormCreateSelector(
  state => state,
  state => orm.session(state.orm),
  (state, props) => props.id,
  (state, props) => props.unfiltered,
  (state, session, id, unfiltered) => {
    try {
      const post = session.Post.get({id})
      if (unfiltered) return post
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
