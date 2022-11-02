import React from 'react'
import { View } from 'react-native'
import PostHeader from './PostHeader'
import PostBody from './PostBody'
import PostGroups from './PostGroups'
import PostFooter from './PostFooter'
import ImageAttachments from 'components/ImageAttachments'
import Files from 'components/Files'
import { capeCod10 } from 'style/colors'

export default function PostCard ({
  goToGroup,
  hideDetails,
  hideMenu,
  post = {},
  respondToEvent,
  showGroups = true,
  showMember,
  showTopic
}) {
  const images = post.imageUrls && post.imageUrls.map(uri => ({ uri }))

  return (
    <View style={styles.container}>
      <PostHeader
        announcement={post.announcement}
        creator={post.creator}
        date={post.createdAt}
        hideMenu={hideMenu}
        pinned={post.pinned}
        postId={post.id}
        showMember={showMember}
        showTopic={showTopic}
        title={post.title}
        topics={post.topics}
        type={post.type}
      />
      <ImageAttachments
        creator={post.creator}
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
        startTime={post.startTime}
        title={post.title}
        type={post.type}
      />
      <Files urls={post.fileUrls} style={{ marginBottom: 10 }} />
      {showGroups && (
        <PostGroups
          goToGroup={goToGroup}
          groups={post.groups}
          includePublic={post.isPublic}
          style={styles.groups}
        />
      )}
      <PostFooter
        commenters={post.commenters}
        commentersTotal={post.commentersTotal}
        eventInvitations={post.eventInvitations}
        postId={post.id}
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
