import { createSelector as ormCreateSelector } from 'redux-orm'
import orm from '../../store/models'
import createCachedSelector from 're-reselect'

const getSession = ormCreateSelector(
  orm,
  state => state.orm,
  session => session
)

const getPost = createCachedSelector(
  getSession,
  (state, props) => props.id,
  (session, id) => session.Post.safeGet({id})
)(
  (state, props) => props.id
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

export const getPresentedPost = createCachedSelector(
  getPost,
  (state, props) => props.communityId,
  (post, communityId) => presentPost(post, communityId)
)(
  (state, props) => `${props.id}:${props.communityId}`
)
