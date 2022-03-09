/* eslint-disable camelcase */
import React, { useEffect, useState, useRef, useImperativeHandle, forwardRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Text, TouchableOpacity, View, SectionList } from 'react-native'
import Comment from 'components/Comment'
import Loading from 'components/Loading'
import styles from './Comments.styles'
import { isEmpty, omit } from 'lodash/fp'
import {
  getHasMoreComments,
  getComments,
  getTotalComments
} from 'store/selectors/getComments'
import fetchCommentsAction from 'store/actions/fetchComments'
import { FETCH_COMMENTS } from 'store/constants'

function Comments ({
  postId,
  header: providedHeader = null,
  style = {},
  showMember,
  slug,
  panHandlers,
  onReply
}, ref) {
  const dispatch = useDispatch()
  const comments = useSelector(state => getComments(state, { postId })) || []
  const pending = useSelector(state => state.pending[FETCH_COMMENTS])
  const fetchComments = () => dispatch(fetchCommentsAction({ postId }))
  const sections = comments.map(comment => ({
    comment: omit(['subComments'], comment),
    data: comment.subComments
  }))
  const [highlightedComment, highlightComment] = useState()
  const commentsListRef = useRef()

  const scrollToComment = comment => {
    const parentCommentId = comment.parentComment || comment.id
    const subCommentId = comment.parentComment ? comment.id : null
    const section = sections.find(section => parentCommentId === section.comment.id)
    const sectionIndex = section.comment.sectionIndex
    const itemIndex = section.data.find(subComment =>
      subCommentId === subComment.id)?.itemIndex || section.data.length + 1
    commentsListRef?.current.scrollToLocation({ sectionIndex, itemIndex })
  }

  useImperativeHandle(ref, () => ({
    scrollToComment,
    highlightComment
  }))

  useEffect(() => { fetchComments() }, [])

  const header = () => (
    <>
      {providedHeader}
      <ShowMore postId={postId} />
      {pending && (
        <View style={styles.loadingContainer}>
          <Loading style={styles.loading} />
        </View>
      )}
    </>
  )

  const renderComment = ({ section: { comment } }) => {
    return (
      <>
        <ShowMore commentId={comment.id} style={styles.subCommentsShowMore} />
        <Comment
          style={
            comment.id === highlightedComment?.id && styles.highlighted
          }
          comment={comment}
          onReply={onReply}
          showMember={showMember}
          slug={slug}
          key={comment.id}
        />
      </>
    )
  }

  const renderSubComment = ({ item: comment }) => {
    return (
      <Comment
        style={[
          comment.id === highlightedComment?.id && styles.highlighted,
          styles.subComment
        ]}
        comment={comment}
        onReply={onReply}
        showMember={showMember}
        slug={slug}
        key={comment.id}
      />
    )
  }

  return (
    <SectionList
      style={style}
      ref={commentsListRef}
      inverted
      ListFooterComponent={header}
      renderSectionFooter={renderComment}
      renderItem={renderSubComment}
      sections={sections}
      keyExtractor={comment => comment.id}
      initialScrollIndex={0}
      keyboardDismissMode='interactive'
      {...panHandlers}
      // NOTE: Because inverted this will make the "footer" rise to the top
      // of the view when the content is shorter than full height
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: 'flex-end'
      }}
    />
  )
}

export default forwardRef(Comments)

export function ShowMore ({ postId, commentId, style = {} }) {
  const queryParams = commentId ? { commentId } : { postId }
  const dispatch = useDispatch()
  const fetchComments = () => dispatch(fetchCommentsAction(queryParams, { cursor }))
  const comments = useSelector(state => getComments(state, queryParams)) || []
  const cursor = !isEmpty(comments) && comments[comments.length - 1].id
  const total = useSelector(state => getTotalComments(state, queryParams)) || 0
  const hasMore = useSelector(state => getHasMoreComments(state, queryParams))

  const extra = total - comments.length

  if (!hasMore || extra < 1) return null

  return (
    <TouchableOpacity>
      <Text style={[styles.showMore, style]} onPress={fetchComments}>
        View {extra} previous comment{extra > 1 ? 's' : ''}
      </Text>
    </TouchableOpacity>
  )
}
