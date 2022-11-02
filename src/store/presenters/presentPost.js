import presentTopic from 'store/presenters/presentTopic'

export default function presentPost (post, groupId) {
  if (!post) return null

  const postMembership = post.postMemberships.toRefArray().find(p =>
    Number(p.group) === Number(groupId))
  const pinned = postMembership && postMembership.pinned

  return {
    ...post.ref,
    attachments: post.attachments
      .orderBy('position').toModelArray(),
    creator: post.creator,
    commenters: post.commenters.toModelArray(),
    eventInvitations: post.eventInvitations.toModelArray().map(eventInvitation => {
      return {
        response: eventInvitation.response,
        ...eventInvitation.person.ref
      }
    }),
    fileAttachments: post.attachments
      .orderBy('position').filter(a => a.type === 'file').toModelArray(),
    fileUrls: post.getFileUrls(),
    groups: post.groups.toModelArray(),
    imageUrls: post.getImageUrls(),
    isPublic: post.isPublic,
    linkPreview: post.linkPreview,
    location: post.location,
    members: post.members.toModelArray().map(person => {
      return {
        ...person.ref,
        skills: person.skills.toRefArray()
      }
    }),
    pinned,
    topics: post.topics.toModelArray().map(topic => presentTopic(topic, {}))
  }
}
