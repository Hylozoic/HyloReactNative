/* eslint-disable camelcase */
import React, { useRef, useLayoutEffect, useCallback, useEffect } from 'react'
import { Text, TouchableOpacity, View, ScrollView } from 'react-native'
import Comment from 'components/Comment'
import Loading from 'components/Loading'
import styles from './Comments.styles'

export default function Comments ({
  comments = [],
  header,
  pending,
  total,
  hasMore,
  fetchComments,
  showMember,
  showTopic,
  slug,
  panHandlers
}) {
  useEffect(() => { fetchComments() }, [])
  useLayoutEffect(() => {
    // NOTE: `setTimeout` used here as their
    // seems no other reliable way to guarantee
    // the bottom is available before scrolling
    if (!pending && total > 0) setTimeout(() => (
      scrollViewRef.current?.scrollToEnd()
    ))
  }, [pending, total])

  const scrollViewRef = useRef()

  return (
    <ScrollView
      ref={scrollViewRef}
      keyboardDismissMode='interactive'
      {...panHandlers}>
      {header}
      <ShowMore
        commentsLength={comments.length}
        total={total}
        hasMore={hasMore}
        fetchComments={fetchComments}
      />
      {pending && <View style={styles.loadingContainer}>
        <Loading style={styles.loading} />
      </View>}
      {comments.map(comment => (
        <Comment
          comment={comment}
          showMember={showMember}
          showTopic={showTopic}
          slug={slug}
          key={comment.id}
        />
      ))}
    </ScrollView>
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
