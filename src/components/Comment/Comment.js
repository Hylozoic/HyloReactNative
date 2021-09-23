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
import styles from './Comment.styles'

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
  onReply,
  onPress: providedOnPress
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

  const onPress = providedOnPress
    ? providedOnPress
    : onReply && (() => onReply(comment, { mention: false }))

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={[styles.container, style]}>
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
                <TouchableOpacity style={styles.replyLink} onPress={() => onReply(comment, { mention: !!comment.parentComment })}>
                  <Icon style={styles.replyLinkIcon} name='Reply' />
                  <Text style={styles.replyLinkText}>Reply</Text>
                </TouchableOpacity>
              )}
              {!hideMenu && (
                <CommentMenu
                  deleteComment={() => deleteCommentWithConfirm(comment.id)}
                  removeComment={() => removeCommentWithConfirm(comment.id)}
                  editComment={editComment}
                />
              )}
            </View>
          </View>
          <HTMLView
            addLineBreaks={true}
            onLinkPress={url => urlHandler(url, showMember, showTopic, slug)}
            stylesheet={styles.richTextStyles}
            textComponentProps={{ style: styles.text }}
            value={presentedText}
          />
        </View>
      </View>
    </TouchableOpacity>
  )
}

export function CommentMenu ({ deleteComment, removeComment, editComment }) {
  const removeLabel = 'Remove Comment'
  const deleteLabel = 'Delete Comment'

  // If the function is defined, than it's a valid action
  const actions = filter(x => x[1], [
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
