import React from 'react'
import { TouchableOpacity, View } from 'react-native'
import { useSelector } from 'react-redux'
import respondToEvent from 'store/actions/respondToEvent'
import { getPresentedPost } from 'store/selectors/getPost'
import PostCard from 'components/PostCard'
import styles from './PostRow.styles'

export default function PostRow ({
  goToGroup,
  postId,
  forGroupId,
  showGroups,
  showMember,
  showPost,
  showTopic
}) {
  const post = useSelector(state => getPresentedPost(state, { postId, forGroupId }))
  const handleRespondToEvent = response => respondToEvent(post.id, response)

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
            goToGroup={goToGroup}
            post={post}
            respondToEvent={handleRespondToEvent}
            showGroups={showGroups}
            showMember={showMember}
            showTopic={showTopic}
          />
        </View>
      </TouchableOpacity>
    </View>
  )
}
