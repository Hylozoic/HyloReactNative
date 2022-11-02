import React from 'react'
import { View } from 'react-native'
import PostHeader from './PostHeader'
import PostBody from './PostBody'
import ImageAttachments from 'components/ImageAttachments'
import PostFooter from './PostFooter'
import PostGroups from './PostGroups'
import { get } from 'lodash/fp'
import { capeCod10 } from 'style/colors'
import Files from 'components/Files'

export default function PostCard ({
  commenters,
  creator,
  fileUrls,
  goToGroup,
  groups,
  hideDetails,
  hideMenu,
  imageUrls,
  isPinned,
  post = {},
  respondToEvent,
  showGroups = true,
  showMember,
  showTopic,
  topics
}) {
  const slug = get('0.slug', groups)
  const images = imageUrls && imageUrls.map(uri => ({ uri }))

  return (
    <View style={styles.container}>
      <PostHeader
        announcement={post.announcement}
        creator={creator}
        date={post.createdAt}
        hideMenu={hideMenu}
        pinned={isPinned}
        postId={post.id}
        showMember={showMember}
        showTopic={showTopic}
        slug={slug}
        title={post.title}
        topics={topics}
        type={post.type}
      />
      <ImageAttachments
        creator={creator}
        images={images}
        title={post.title}
      />
      <PostBody
        details={post.details}
        endTime={post.endTime}
        hideDetails={hideDetails}
        linkPreview={post.linkPreview}
        linkPreviewFeatured={post.linkPreviewFeatured}
        myEventResponse={post.myEventResponse}
        respondToEvent={respondToEvent}
        shouldTruncate
        slug={slug}
        startTime={post.startTime}
        title={post.title}
        type={post.type}
      />
      <Files urls={fileUrls} style={{ marginBottom: 10 }} />
      {showGroups && (
        <PostGroups
          goToGroup={goToGroup}
          groups={groups}
          includePublic={post.isPublic}
          slug={slug}
          style={styles.groups}
        />
      )}
      <PostFooter
        commenters={commenters}
        commentersTotal={post.commentersTotal}
        eventInvitations={post.eventInvitations}
        id={post.id}
        members={post.members}
        myVote={post.myVote}
        votesTotal={post.votesTotal}
      />
    </View>
  )
}

const styles = {
  container: {
    backgroundColor: 'white',
    borderColor: capeCod10,
    borderRadius: 4,
    borderWidth: 1
  },
  groups: {
    paddingBottom: 10,
    paddingHorizontal: 12
  }
}
