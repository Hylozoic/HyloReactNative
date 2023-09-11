import React from 'react'
import { View, Text } from 'react-native'
import { LocationHelpers } from 'hylo-shared'
import PostHeader from './PostHeader'
import PostBody from './PostBody'
import PostGroups from './PostGroups'
import PostFooter from './PostFooter'
import ImageAttachments from 'components/ImageAttachments'
import Files from 'components/Files'
import Icon from 'components/Icon'
import Topics from 'components/Topics'
import styles from 'components/PostCard/PostCard.styles'
import { useCurrentUser } from 'hooks/useCurrentUser'

export default function PostCard ({
  goToGroup,
  hideDetails,
  hideMenu,
  onPress,
  post = {},
  respondToEvent,
  showGroups = true,
  showMember,
  childPost,
  showTopic: goToTopic
}) {
  const images = post.imageUrls && post.imageUrls.map(uri => ({ uri }))
  const locationText = LocationHelpers.generalLocationString(post.locationObject, post.location)
  const currentUser = useCurrentUser()

  return (
    <>
      {childPost && (
        <View style={styles.childPost}>
          <View style={styles.childPostInner}>
            <Icon name='Subgroup' style={styles.childPostIcon} /><Text style={styles.childPostText}>{' '}post from child group</Text>
          </View>
        </View>)}
      <View style={styles.container}>
        <PostHeader
          announcement={post.announcement}
          creator={post.creator}
          date={post.createdAt}
          hideMenu={hideMenu}
          pinned={post.pinned}
          postId={post.id}
          showMember={showMember}
          title={post.title}
          type={post.type}
        />
        {(!images || images.length === 0) && (
          <Topics
            topics={post.topics}
            onPress={t => goToTopic(t.name)}
            style={styles.topics}
          />
        )}
        {(images && images.length > 0) && (
          <ImageAttachments
            creator={post.creator}
            images={images}
            onlyLongPress
            onPress={onPress}
            style={styles.images}
            title={post.title}
          >
            <Topics
              topics={post.topics}
              onPress={t => goToTopic(t.name)}
              style={[styles.topics, styles.topicsOnImage]}
            />
          </ImageAttachments>
        )}
        {!!locationText && (
          <View style={styles.locationRow}>
            <Icon style={styles.locationIcon} name='Location' />
            <Text style={styles.locationText} selectable>{locationText}</Text>
          </View>
        )}
        <PostBody
          details={post.details}
          post={post}
          currentUser={currentUser}
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
        <Files urls={post.fileUrls} style={styles.files} />
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
          onPress={onPress}
          postId={post.id}
          members={post.members}
        />
      </View>
    </>
  )
}
