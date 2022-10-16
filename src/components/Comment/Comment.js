import React from 'react'
import { Image, Text, View, Alert, TouchableOpacity } from 'react-native'
import { filter } from 'lodash/fp'
import { TextHelpers } from 'hylo-shared'
import Clipboard from '@react-native-community/clipboard'
import { useHyloActionSheet } from 'components/PopupMenuButton/PopupMenuButton'
import { openURL } from 'navigation/linking'
import Avatar from 'components/Avatar'
import HyloHTML from 'components/HyloHTML'
import Icon from 'components/Icon'
import styles from './Comment.styles'

export default function Comment ({
  comment,
  canModerate,
  clearHighlighted,
  isCreator,
  deleteComment,
  displayPostTitle,
  editComment,
  hideMenu,
  highlighted,
  onPress,
  onReply,
  scrollTo,
  setHighlighted,
  showMember,
  style
}) {
  const { showHyloActionSheet } = useHyloActionSheet()
  const { creator, text, createdAt, post } = comment
  let postTitle = post?.title

  if (displayPostTitle && postTitle) {
    postTitle = TextHelpers.truncateText(postTitle, 40)
  }

  const handleReply = onReply && (() => onReply(comment))
  // Currently will be beat by native "Copy" context menu when over the actual text of the Comment
  // const handleLongPress = onLongPress || handleReply
  const imageAttachments = filter({ type: 'image' }, comment?.attachments)

  // NOTE: Currently no UI for adding comment file attachments
  // const fileAttachments = filter({ type: 'file' }, comment?.attachments)
  const commentMenuActions = [
    [
      'Reply',
      handleReply,
      {
        icon: <Icon style={styles.replyLinkIcon} name='Replies' />
      }
    ],
    [
      'Copy',
      () => Clipboard.setString(TextHelpers.presentHTMLToText(comment.text))
    ],
    [
      'Edit Comment',
      editComment
    ],
    [
      'Remove Comment',
      (!isCreator && canModerate && deleteComment) && (
        () => Alert.alert(
          'Moderator: Confirm Delete',
          'Are you sure you want to remove this comment?',
          [
            { text: 'Yes', onPress: () => deleteComment(comment.id) },
            { text: 'Cancel', style: 'cancel' }
          ]
        )
      ),
      {
        destructive: true
      }
    ],
    [
      'Delete Comment',
      (isCreator && deleteComment) && (
        () => Alert.alert(
          'Confirm Delete',
          'Are you sure you want to delete this comment?',
          [
            { text: 'Yes', onPress: () => deleteComment(comment.id) },
            { text: 'Cancel', style: 'cancel' }
          ]
        )
      ),
      {
        destructive: true
      }
    ]
  ]

  const showActionSheet = () => {
    setHighlighted()
    scrollTo(0.9)
    showHyloActionSheet(
      { actions: commentMenuActions },
      index => {
        if (commentMenuActions[index][1]) {
          commentMenuActions[index][1]()
        }

        if (commentMenuActions[index][0] !== 'Reply') clearHighlighted()
      }
    )
  }

  return (
    <TouchableOpacity onPress={onPress} onLongPress={showActionSheet}>
      <View style={[styles.container, highlighted && styles.highlighted, style]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => showMember(creator.id)}>
            <Avatar avatarUrl={creator.avatarUrl} style={styles.avatar} />
          </TouchableOpacity>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={() => showMember(creator.id)}>
              <Text style={styles.name}>{creator.name}</Text>
            </TouchableOpacity>
            <Text style={styles.date}>{TextHelpers.humanDate(createdAt)}</Text>
            {displayPostTitle &&
              <Text style={styles.date}>on "{postTitle}"</Text>}
          </View>
          <View style={styles.headerMiddle} />
          <View style={styles.headerRight}>
            {handleReply && (
              <TouchableOpacity style={styles.replyLink} onPress={handleReply}>
                <Icon style={styles.replyLinkIcon} name='Replies' />
              </TouchableOpacity>
            )}
            {!hideMenu && (
              <TouchableOpacity
                onPress={showActionSheet}
                hitSlop={{ top: 20, bottom: 10, left: 0, right: 15 }}
              >
                <Icon name='More' style={styles.menuIcon} />
              </TouchableOpacity>
            )}
          </View>
        </View>
        {imageAttachments && imageAttachments.map(({ url }, i) => (
          <TouchableOpacity onPress={() => openURL(url)} key={i}>
            <Image source={{ uri: url }} resizeMode='cover' style={styles.imageAttachemnt} />
          </TouchableOpacity>
        ))}
        <View style={styles.body}>
          <HyloHTML html={text} />
        </View>
      </View>
    </TouchableOpacity>
  )
}
