// import presentTopic from 'store/presenters/presentTopic'

import { RESPONSES } from 'store/models/EventInvitation'

export default (post, groupId) => {
  if (!post) return null
  const postMembership = post.postMemberships.filter(p =>
    Number(p.group) === Number(groupId)).toRefArray()[0]
  const pinned = postMembership && postMembership.pinned
  return {
    ...post.ref,
    creator: post.creator?.ref,
    linkPreview: post.linkPreview,
    isPublic: post.isPublic,
    commenters: post.commenters.toRefArray(),
    groups: post.groups.toRefArray(),
    fileAttachments: post.attachments.filter(a => a.type === 'file').toRefArray(),
    fileUrls: post.getFileUrls(),
    imageUrls: post.getImageUrls(),
    pinned,
    myEventResponse: post.myEventResponse || RESPONSES.NO,
    // From Web, not yet tested/used
    // topics: post.topics.toModelArray().map(topic => presentTopic(topic, {})),
    topics: post.topics.toRefArray(),
    members: post.members.toModelArray().map(person => {
      return {
        ...person.ref,
        skills: person.skills.toRefArray()
      }
    }),
    eventInvitations: post.eventInvitations.toModelArray().map(eventInvitation => {
      return {
        response: eventInvitation.response,
        ...eventInvitation.person.ref
      }
    })
  }
}
