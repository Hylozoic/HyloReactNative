import React from 'react'
import { TouchableOpacity, View } from 'react-native'
import styles from './PostRow.styles'
import PostCard from 'components/PostCard'

export default function PostRow ({
  commenters,
  creator,
  fileUrls,
  goToGroup,
  groups,
  imageUrls,
  isPinned,
  post,
  respondToEvent,
  showGroups,
  showMember,
  showPost,
  showTopic,
  topics
}) {
  if (!post) return null

  return (
    <View style={styles.postRow}>
      <TouchableOpacity
        activeOpacity={0.6}
        delayPressIn={50}
        onPress={() => showPost(post.id)}
      >
        <View>
          <PostCard
            commenters={commenters}
            creator={creator}
            fileUrls={fileUrls}
            goToGroup={goToGroup}
            groups={groups}
            imageUrls={imageUrls}
            isPinned={isPinned}
            post={post}
            respondToEvent={response => respondToEvent(post.id, response)}
            showGroups={showGroups}
            showMember={showMember}
            showTopic={showTopic}
            topics={topics}
          />
        </View>
      </TouchableOpacity>
    </View>
  )
}
