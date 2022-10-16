import React from 'react'
import { Image, Text, View, Alert, TouchableOpacity } from 'react-native'
import { filter } from 'lodash/fp'
import Clipboard from '@react-native-community/clipboard'
import { TextHelpers } from 'hylo-shared'
import { openURL } from 'navigation/linking'
import { useDispatch, useSelector } from 'react-redux'
import { useHyloActionSheet } from 'hooks/useHyloActionSheet'
import deleteCommentAction from 'store/actions/deleteComment'
import getGroup from 'store/selectors/getGroup'
import getMe from 'store/selectors/getMe'
import Avatar from 'components/Avatar'
import HyloHTML from 'components/HyloHTML'
import Icon from 'components/Icon'
import styles from './Comment.styles'
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5'

export default function Comment ({
  comment,
  clearHighlighted,
  displayPostTitle,
  hideMenu = true,
  highlighted,
  onPress,
  onReply,
  scrollTo,
  setHighlighted,
  showMember,
  style,
  slug
}) {
  const dispatch = useDispatch()
  const { showHyloActionSheet } = useHyloActionSheet()
  const currentUser = useSelector(getMe)
  const group = useSelector(state => getGroup(state, { slug }))

  const canModerate = currentUser && currentUser.canModerate(group)
  const isCreator = currentUser && (comment.creator.id === currentUser.id)

  const { creator, text, createdAt, post } = comment
  const postTitle = displayPostTitle && post?.title && TextHelpers.truncateText(post.title, 40)

  const handleReply = onReply && (() => onReply(comment))
  const handleRemove = (!isCreator && canModerate) && (
    () => Alert.alert(
      'Moderator: Confirm Delete',
      'Are you sure you want to remove this comment?',
      [
        { text: 'Yes', onPress: () => dispatch(deleteCommentAction(comment.id)) },
        { text: 'Cancel', style: 'cancel' }
      ]
    )
  )
  const handleDelete = isCreator && (
    () => {
      Alert.alert(
        'Confirm Delete',
        'Are you sure you want to delete this comment?',
        [
          { text: 'Yes', onPress: () => dispatch(deleteCommentAction(comment.id)) },
          { text: 'Cancel', style: 'cancel' }
        ]
      )
    }
  )
  const handleCopy = () => Clipboard.setString(TextHelpers.presentHTMLToText(comment.text))

  const commentMenuActions = [
    ['Reply', handleReply, {
      icon: <Icon style={styles.actionSheetIcon} name='Replies' />
    }],
    ['Copy', handleCopy, {
      icon: <FontAwesome5Icon style={styles.actionSheetIcon} name='copy' />
    }],
    ['Remove', handleRemove, {
      icon: <FontAwesome5Icon style={styles.actionSheetIcon} name='trash-alt' />,
      destructive: true
    }],
    ['Delete', handleDelete, {
      icon: <FontAwesome5Icon style={styles.actionSheetIcon} name='trash-alt' />,
      destructive: true
    }]
  ]

  const showActionSheet = () => {
    setHighlighted()
    scrollTo(0.9)
    showHyloActionSheet(
      { actions: commentMenuActions },
      action => {
        if (action[0] !== 'Reply') clearHighlighted()
      }
    )
  }

  const imageAttachments = filter({ type: 'image' }, comment?.attachments)
  // NOTE: Currently no UI for adding comment file attachments
  // const fileAttachments = filter({ type: 'file' }, comment?.attachments)

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
            {displayPostTitle && (
              <Text style={styles.date}>on "{postTitle}"</Text>
            )}
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
