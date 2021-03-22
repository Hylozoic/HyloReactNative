import { createSelector as ormCreateSelector } from 'redux-orm'
import orm from 'store/models'
import { createSelector } from 'reselect'
import { get } from 'lodash/fp'

const getPost = ormCreateSelector(
  orm,
  (state, props) => props.id,
  (session, id) => session?.Post.safeGet({ id })
)

export default getPost

export const presentPost = (post, groupId) => {
  if (!post) return null
  const postMembership = post.postMemberships.filter(p =>
    Number(p.group) === Number(groupId)).toRefArray()[0]
  const pinned = postMembership && postMembership.pinned
  return {
    ...post.ref,
    creator: post.creator && post.creator.ref,
    linkPreview: post.linkPreview,
    commenters: post.commenters.toRefArray(),
    groups: post.groups.toRefArray(),
    fileAttachments: post.attachments.filter(a => a.type === 'file').toRefArray(),
    fileUrls: post.getFileUrls(),
    imageUrls: post.getImageUrls(),
    pinned,
    topics: post.topics.toRefArray(),
    members: post.members.toRefArray()
  }
}

export const getPresentedPost = createSelector(
  getPost,
  (state, props) => get('id', props),
  (state, props) => get('groupId', props),
  (post, id, groupId) => presentPost(post, groupId)
)
