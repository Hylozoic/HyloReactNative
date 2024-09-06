import React from 'react'
import { TouchableOpacity, View } from 'react-native'
import { useDispatch } from 'react-redux'
import respondToEvent from 'store/actions/respondToEvent'
// import { getPresentedPost } from 'store/selectors/getPost'
import { gql } from 'urql'
import useUrqlQueryAction from 'urql-shared/hooks/useUrqlQueryAction'
import fetchPost from 'store/actions/fetchPost'
import PostCard from 'components/PostCard'
import styles from './PostRow.styles'

export default function PostRow ({
  context,
  goToGroup,
  postId,
  forGroupId,
  showGroups,
  showMember,
  showPost,
  showTopic
}) {
  const dispatch = useDispatch()
  const [{ data, pending, error }] = useUrqlQueryAction({ action: fetchPost(postId), variables: { id: postId } })
  const post = data?.post

  if (pending || !post) return null

  const handleRespondToEvent = response => dispatch(respondToEvent(post, response))
  const groupIds = post.groups.map(group => group.id)

  return (
    <View style={styles.postRow}>
      <TouchableOpacity
        activeOpacity={0.6}
        delayPressIn={50}
        onPress={() => showPost(post.id)}
      >
        <PostCard
          goToGroup={goToGroup}
          post={post}
          onPress={() => showPost(post.id)}
          respondToEvent={handleRespondToEvent}
          showGroups={showGroups}
          showMember={showMember}
          showTopic={showTopic}
          childPost={forGroupId !== 'all' && forGroupId !== 'public' && context !== 'my' && !groupIds.includes(forGroupId)}
        />
      </TouchableOpacity>
    </View>
  )
}
