/* eslint-disable camelcase */
import React, { useRef, useLayoutEffect, useState, useCallback, useEffect } from 'react'
import { Text, TouchableOpacity, View, ScrollView } from 'react-native'
import Comment from 'components/Comment'
import Loading from 'components/Loading'
import styles from './Comments.styles'
import { FlatList } from 'react-native-gesture-handler'
import { logout } from 'screens/Login/actions'

export default function Comments ({
  commentId,
  postId,
  comments = [],
  header = null,
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
  replyMaker,
  onReply
}) {
  useEffect(() => { if (!commentId) fetchComments() }, [])

  const renderItem = ({ item: comment }) => {
    return <Comment comment={comment}
      onReply={replyMaker({ onReply, comment })}
      replyMaker={replyMaker}
      showMember={showMember}
      showTopic={showTopic}
      slug={slug}
      key={comment.id} />
  }

  // TOO: Re-integrate "Show more" and pending...
  //     <ShowMore
  //       commentsLength={comments.length}
  //       total={total}
  //       hasMore={hasMore}
  //       fetchComments={fetchComments}
  //     />
  //     {pending && <View style={styles.loadingContainer}>
  //       <Loading style={styles.loading} />
  //     </View>}
  
  return (
    <FlatList
      style={style}
      ref={scrollViewRef}
      data={comments}
      keyExtractor={comment => comment.id}
      renderItem={renderItem}
      keyboardDismissMode='interactive'
      ListFooterComponent={header}
      inverted
      initialScrollIndex={0}
      {...panHandlers} />
  )
}

export function ShowMore ({ total = 0, hasMore, fetchComments }) {
  const extra = total - 10

  if (!hasMore || extra < 1) return null

  return (
    <TouchableOpacity>
      <Text style={styles.showMore} onPress={fetchComments}>
        View {extra} previous comment{extra > 1 ? 's' : ''}
      </Text>
    </TouchableOpacity>
  )
}
