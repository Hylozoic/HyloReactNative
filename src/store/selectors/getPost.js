import { createSelector as ormCreateSelector } from 'redux-orm'
import presentPost from 'store/presenters/presentPost'
import orm from 'store/models'
import { createSelector } from 'reselect'
import { get } from 'lodash/fp'

const getPost = ormCreateSelector(
  orm,
  (state, props) => props.id,
  (session, id) => session?.Post.safeGet({ id })
)

export default getPost

export const getPresentedPost = createSelector(
  getPost,
  (state, props) => get('id', props),
  (state, props) => get('groupId', props),
  (post, id, groupId) => presentPost(post, groupId)
)
