import { createSelector as ormCreateSelector } from 'reselect'
import orm from '../../store/models'

const getPost = ormCreateSelector(
  state => state,
  state => orm.session(state.orm),
  (state, props) => props.id,
  (state, { Post }, id) => Post.hasId(id) && Post.withId(id)
)

export default getPost
