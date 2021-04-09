/* eslint-disable camelcase */
import React, { useRef, useLayoutEffect, useState, useCallback, useEffect } from 'react'
import { Text, TouchableOpacity, View, ScrollView } from 'react-native'
import Comment from 'components/Comment'
import Loading from 'components/Loading'
import styles from './Comments.styles'
import { FlatList } from 'react-native-gesture-handler'

export default function Comments ({
  comments = [],
  allowReply = true,
  header = null,
  pending,
  total,
  hasMore,
  fetchComments,
  style = {},
  showMember,
  showTopic,
  slug,
  panHandlers
}) {
  useEffect(() => { fetchComments() }, [])

  const scrollViewRef = useRef()

  const handleReply = comment => {
    scrollViewRef.current?.scrollToIndex({
      index: comments.findIndex(c => c.id == comment.id)
    })
  }

  const renderItem = comment => {
    return <Comment comment={comment.item}
      allowReply={allowReply}
      onReply={handleReply}
      showMember={showMember}
      showTopic={showTopic}
      slug={slug}
      key={comment.item.id} />
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
