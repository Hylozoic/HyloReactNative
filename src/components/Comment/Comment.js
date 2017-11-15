/* eslint-disable camelcase */
import React from 'react'
import { StyleSheet, Text, View, Alert } from 'react-native'
import HTMLView from 'react-native-htmlview'
import { present, sanitize, humanDate } from 'hylo-utils/text'
import { get, isEmpty, filter } from 'lodash/fp'

import Avatar from '../Avatar'
import PopupMenuButton from '../PopupMenuButton'
import Icon from '../Icon'
import urlHandler from '../../util/urlHandler'
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
  removeComment
}) {
  const {creator, text, createdAt, post} = comment
  const presentedText = present(sanitize(text), {slug})

  const deleteCommentWithConfirm = deleteComment ? () => Alert.alert(
    'Confirm Delete',
    'Are you sure you want to delete this comment?',
    [
      {text: 'Yes', onPress: () => deleteComment()},
      {text: 'Cancel', style: 'cancel'}
    ]) : null

  const removeCommentWithConfirm = removeComment ? () => Alert.alert(
    'Moderator: Confirm Delete',
    'Are you sure you want to remove this comment?',
    [
      {text: 'Yes', onPress: () => removeComment()},
      {text: 'Cancel', style: 'cancel'}
    ]) : null

  var postTitle = get('title', post)
  if (displayPostTitle && postTitle) {
    postTitle = postTitle.length > 40
      ? postTitle.substring(0, 40) + '...'
      : postTitle
  }

  return <View style={[style, styles.container]}>
    <Avatar avatarUrl={creator.avatarUrl} style={styles.avatar} />
    <View style={styles.details}>
      <View style={styles.header}>
        <View style={styles.meta}>
          <Text style={styles.name}>{creator.name}</Text>
          <Text style={styles.date}>{humanDate(createdAt)}</Text>
          {displayPostTitle &&
          <Text style={styles.date}>on "{postTitle}"</Text>}
        </View>
        <View style={styles.headerRight}>
          <CommentMenu deleteComment={deleteCommentWithConfirm} removeComment={removeCommentWithConfirm} />
        </View>

      </View>
      <HTMLView
        addLineBreaks={false}
        onLinkPress={url => urlHandler(url, showMember, showTopic, slug)}
        stylesheet={richTextStyles}
        textComponentProps={{style: styles.text}}
        value={presentedText} />
    </View>
  </View>
}

export function CommentMenu ({deleteComment, removeComment}) {
  // If the function is defined, than it's a valid action
  const removeLabel = 'Remove this Comment'
  const deleteLabel = 'Delete this Comment'

  const actions = filter(x => x[1], [
    [deleteLabel, deleteComment],
    [removeLabel, removeComment]
  ])

  if (isEmpty(actions)) return null

  const destructiveLabels = [deleteLabel, removeLabel]
  const destructiveButtonIndex = destructiveLabels.includes(actions[0][0]) ? 0 : -1

  return <PopupMenuButton actions={actions}
    hitSlop={{top: 20, bottom: 10, left: 10, right: 15}}
    destructiveButtonIndex={destructiveButtonIndex}>
    <Icon name='More' style={styles.menuIcon} />
  </PopupMenuButton>
}

const richTextStyles = StyleSheet.create({
  a: {
    color: caribbeanGreen
  },
  p: {
    marginTop: 3,
    marginBottom: 3
  }
})
