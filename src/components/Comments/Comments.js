/* eslint-disable camelcase */
import React, { useEffect } from 'react'
import { Text, TouchableOpacity, View, } from 'react-native'
import Comment from 'components/Comment'
import Loading from 'components/Loading'
import styles from './Comments.styles'
import { FlatList } from 'react-native-gesture-handler'
import SubComments from 'components/Comments'

export default function Comments ({
  commentId,
  comments = [],
  header: providedHeader = null,
  pending,
  total,
  hasMore,
  fetchComments,
  style = {},
  showMember,
  showTopic,
  slug,
  panHandlers,
  scrollViewRef,
  onReply
}) {
  useEffect(() => { if (!commentId) fetchComments() }, [])

  const header = () => (
    <>
      {providedHeader}
      <ShowMore
        commentsLength={comments.length}
        total={total}
        hasMore={hasMore}
        fetchComments={fetchComments}
      />
      {pending && <View style={styles.loadingContainer}>
        <Loading style={styles.loading} />
      </View>}
    </>
  )

  const renderItem = ({ item: comment }) => {
    return <>
      <SubComments
        style={{ marginLeft: 50 }}
        commentId={comment.id}
        showMember={showMember}
        showTopic={showTopic}
        onReply={onReply}
        slug={slug}
      />
      <Comment comment={comment}
        onReply={onReply}
        showMember={showMember}
        showTopic={showTopic}
        slug={slug}
        key={comment.id} />
    </>
  }

  return (
    <FlatList style={style}
      inverted
      ref={scrollViewRef}
      data={comments}
      keyExtractor={comment => comment.id}
      initialScrollIndex={0}
      renderItem={renderItem}
      ListFooterComponent={header}
      keyboardDismissMode='interactive'
      {...panHandlers}
    />
  )
}

export function ShowMore ({ total = 0, commentsLength, hasMore, fetchComments }) {
  const extra = total - commentsLength

  if (!hasMore || extra < 1) return null

  return (
    <TouchableOpacity>
      <Text style={styles.showMore} onPress={fetchComments}>
        View {extra} previous comment{extra > 1 ? 's' : ''}
      </Text>
    </TouchableOpacity>
  )
}
