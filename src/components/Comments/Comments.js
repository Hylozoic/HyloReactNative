/* eslint-disable camelcase */
import React, { forwardRef, useRef, useCallback, useEffect } from 'react'
import { Text, TouchableOpacity, View, ScrollView } from 'react-native'
import Comment from 'components/Comment'
import Loading from 'components/Loading'
import styles from './Comments.styles'

export default forwardRef(({
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
}, scrollViewRef) => {
    const scrollToEnd = useCallback((animated = true) => {
      scrollViewRef.current?.scrollToEnd({ animated })
    })
    useEffect(() => { scrollToEnd() }, [scrollViewRef.current])
    
    return (
      <ScrollView
        ref={scrollViewRef}
        // onContentSizeChange={scrollToEnd}
        {...panHandlers}
        keyboardDismissMode='interactive'>
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
)

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
