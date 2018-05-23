import { createSelector as ormCreateSelector } from 'redux-orm'
import orm from '../../store/models'
import { createSelector } from 'reselect'
import { get } from 'lodash/fp'
import { random } from 'lodash'

const getPost = ormCreateSelector(
  orm,
  state => state.orm,
  (state, props) => props.id,
  ({ Post }, id) => Post.safeGet({id})
)

export default getPost

export const presentPost = (post, communityId) => {
  if (!post) return null
  const postMembership = post.postMemberships.filter(p =>
    Number(p.community) === Number(communityId)).toRefArray()[0]
  const pinned = postMembership && postMembership.pinned
  return {
    ...post.ref,
    creator: post.creator,
    linkPreview: post.linkPreview,
    commenters: post.commenters.toModelArray(),
    communities: post.communities.toModelArray(),
    fileAttachments: post.attachments.filter(a => a.type === 'file').toModelArray(),
    fileUrls: post.getFileUrls(),
    imageUrls: post.getImageUrls(),
    pinned,
    topics: post.topics.toModelArray()
  }
}

// Factory method so each instance can have its own selector, thus allowing shared selectors across multiple components.
// @see https://github.com/reduxjs/reselect#sharing-selectors-with-props-across-multiple-component-instances
export const makeGetPresentedPost = () => {
  const _getPost = ormCreateSelector(
    orm,
    state => state.orm,
    (state, props) => props.id,
    ({ Post }, id) => Post.safeGet({id})
  )

  return createSelector(
    _getPost,
    (state, props) => props.communityId,
    (post, communityId) => presentPost(post, communityId)
  )
}

export const getPresentedPost = createSelector(
  getPost,
  (state, props) => get('id', props),
  (state, props) => get('communityId', props),
  (post, id, communityId) => presentPost(post, communityId)
)
