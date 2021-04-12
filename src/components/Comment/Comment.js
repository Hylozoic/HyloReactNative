/* eslint-disable camelcase */
import React from 'react'
import { StyleSheet, Text, View, Alert, TouchableOpacity } from 'react-native'
import HTMLView from 'react-native-htmlview'
import { get, isEmpty, filter, findLastIndex } from 'lodash/fp'
import { present, sanitize, humanDate } from 'hylo-utils/text'
import urlHandler from 'navigation/linking/urlHandler'
import Avatar from 'components/Avatar'
import PopupMenuButton from 'components/PopupMenuButton'
import Icon from 'components/Icon'
import SubComments from 'components/Comments'
import styles from './Comment.styles'
import { caribbeanGreen } from 'style/colors'

export default function Comment ({
  comment,
  showMember,
  showTopic,
  slug,
  style,
  displayPostTitle,
  deleteComment,
  removeComment,
  editComment,
  hideMenu,
  onReply
}) {
  const { creator, text, createdAt, post } = comment
  const presentedText = present(sanitize(text), { slug })

  const deleteCommentWithConfirm = deleteComment ? commentId => Alert.alert(
    'Confirm Delete',
    'Are you sure you want to delete this comment?',
    [
      { text: 'Yes', onPress: () => deleteComment(commentId) },
      { text: 'Cancel', style: 'cancel' }
    ]) : null

  const removeCommentWithConfirm = removeComment ? commentId => Alert.alert(
    'Moderator: Confirm Delete',
    'Are you sure you want to remove this comment?',
    [
      { text: 'Yes', onPress: () => removeComment(commentId) },
      { text: 'Cancel', style: 'cancel' }
    ]) : null
  
  let postTitle = get('title', post)

  if (displayPostTitle && postTitle) {
    postTitle = postTitle.length > 40
      ? postTitle.substring(0, 40) + '...'
      : postTitle
  }

  return (
    <>
      <SubComments
        style={{ marginLeft: 50 }}
        commentId={comment.id}
        showMember={showMember}
        showTopic={showTopic}
        slug={slug}
        deleteComment={deleteComment}
        removeComment={removeComment}
        editComment={editComment}
        hideMenu={hideMenu}
        key={comment.id}
        onReply={onReply}
      />
      <View style={[style, styles.container]}>
        <TouchableOpacity onPress={() => showMember(creator.id)}>
          <Avatar avatarUrl={creator.avatarUrl} style={styles.avatar} />
        </TouchableOpacity>
        <View style={styles.details}>
          <View style={styles.header}>
            <View style={styles.meta}>
              <TouchableOpacity onPress={() => showMember(creator.id)}>
                <Text style={styles.name}>{creator.name}</Text>
              </TouchableOpacity>
              <Text style={styles.date}>{humanDate(createdAt)}</Text>
              {displayPostTitle &&
                <Text style={styles.date}>on "{postTitle}"</Text>}
            </View>
            <View style={styles.headerRight}>
              {onReply && (
                <TouchableOpacity style={styles.replyLink} onPress={() => onReply(comment)}>
                  <Icon style={styles.replyLinkIcon} name='Reply' />
                  <Text style={styles.replyLinkText}>Reply</Text>
                </TouchableOpacity>
              )}
              {!hideMenu && (
                <CommentMenu
                  deleteComment={() => deleteCommentWithConfirm(comment.id)}
                  removeComment={() => removeCommentWithConfirm(comment.id)}
                  replyComment={() => onReply(comment)}
                  editComment={editComment}
                />
              )}
            </View>
          </View>
          <HTMLView
            addLineBreaks={false}
            onLinkPress={url => urlHandler(url, showMember, showTopic, slug)}
            stylesheet={styles.richTextStyles}
            textComponentProps={{ style: styles.text }}
            value={presentedText}
          />
        </View>
      </View>
    </>
  )
}

export function CommentMenu ({ replyComment, deleteComment, removeComment, editComment }) {
  // If the function is defined, than it's a valid action
  const removeLabel = 'Remove Comment'
  const deleteLabel = 'Delete Comment'

  const actions = filter(x => x[1], [
    ['Reply', replyComment],
    ['Edit Comment', editComment],
    [deleteLabel, deleteComment],
    [removeLabel, removeComment]
  ])

  if (isEmpty(actions)) return null

  const destructiveLabels = [deleteLabel, removeLabel]
  const destructiveButtonIndex = findLastIndex(action => destructiveLabels.includes(action[0]), actions)

  return (
    <PopupMenuButton
      actions={actions}
      hitSlop={{ top: 20, bottom: 10, left: 0, right: 15 }}
      destructiveButtonIndex={destructiveButtonIndex}
    >
      <Icon name='More' style={styles.menuIcon} />
    </PopupMenuButton>
  )
}
