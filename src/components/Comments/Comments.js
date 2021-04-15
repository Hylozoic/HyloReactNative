/* eslint-disable camelcase */
import React, { useEffect, forwardRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Text, TouchableOpacity, View, SectionList } from 'react-native'
import Comment from 'components/Comment'
import Loading from 'components/Loading'
import styles from './Comments.styles'
import { isEmpty } from 'lodash/fp'
import {
  getHasMoreComments,
  getComments,
  getTotalComments
} from 'store/selectors/getComments'
import fetchCommentsAction from 'store/actions/fetchComments'
import { FETCH_COMMENTS } from 'store/constants'
import fetchComments from 'store/actions/fetchComments'

function Comments ({
  postId,
  header: providedHeader = null,
  style = {},
  showMember,
  showTopic,
  slug,
  panHandlers,
  onReply
}, ref) {
  const dispatch = useDispatch()
  const comments = useSelector(state => getComments(state, { postId })) || []
  const total = useSelector(state => getTotalComments(state, { postId }))
  const hasMore = useSelector(state => getHasMoreComments(state, { postId }))
  const pending = useSelector(state => state.pending[FETCH_COMMENTS])
  const cursor = !isEmpty(comments) && comments[comments.length - 1].comment.id
  const fetchComments = () => dispatch(fetchCommentsAction({ postId }, { cursor }))

  const sections = comments

  useEffect(() => { fetchComments() }, [])

  const header = () => (
    <>
      {providedHeader}
      <ShowMore
        commentsLength={comments.length}
        total={total}
        hasMore={hasMore}
        fetchComments={() => { fetchComments() }}
      />
      {pending && <View style={styles.loadingContainer}>
        <Loading style={styles.loading} />
      </View>}
    </>
  )

  const renderComment = ({ section: { comment }}) => (
    <Comment comment={comment}
      onReply={onReply}
      showMember={showMember}
      showTopic={showTopic}
      slug={slug}
      key={comment.id} />
  )

  const renderSubComment = ({ item: comment }) => {
    return <>
      <View style={{ marginLeft: 40 }}>
        <Comment
          comment={comment}
          onReply={onReply}
          showMember={showMember}
          showTopic={showTopic}
          slug={slug}
          key={comment.id} />
      </View>
    </>
  }

  return (
    <SectionList style={style}
      ref={ref}
      inverted
      ListFooterComponent={header}
      renderSectionFooter={renderComment}
      renderItem={renderSubComment}
      sections={sections}
      keyExtractor={comment => comment.id}
      initialScrollIndex={0}
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
