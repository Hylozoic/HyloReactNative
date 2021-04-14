/* eslint-disable camelcase */
import React, { useEffect, forwardRef } from 'react'
import { Text, TouchableOpacity, View, } from 'react-native'
import Comment from 'components/Comment'
import Loading from 'components/Loading'
import styles from './Comments.styles'
import { FlatList } from 'react-native-gesture-handler'
import SubComments from 'components/Comments'

function Comments ({
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
      {!comment.parentComment && (
        <SubComments
          style={{ marginLeft: 50 }}
          commentId={comment.id}
          showMember={showMember}
          showTopic={showTopic}
          onReply={onReply}
          slug={slug}
          // TODO: To achieved subcomment list scrolling --
          //       1) Wrap Comments in a forwardRef and change scrollViewRef
          //          to commentsRef.current.scrollViewRef (in PostDetails usage).
          //       2) Create a parentCommentId keyed list of subcomment refs
          //          (maybe `const subCommentsScrollViewRefs = useRef({})` and
          //          `sunCommentsScrollViewRefs.current[commentId])?
          //  ref: https://mattclaffey.medium.com/adding-react-refs-to-an-array-of-items-96e9a12ab40c
          //  ref: https://www.reddit.com/r/reactnative/comments/aewpd6/access_scrollview_ref_child_inside_flatlist/
          //  ref: https://stackoverflow.com/questions/59411210/array-of-refs-in-functional-component-to-change-classnames-of-individual-items-v
          // scrollViewRef={subCommentsScrollViewRef}
        />
      )}
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

export default forwardRef(Comments)

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
