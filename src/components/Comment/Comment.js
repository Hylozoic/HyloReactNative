import React, { useEffect, useState } from 'react'
import { Text, View, Alert, TouchableOpacity } from 'react-native'
import { filter } from 'lodash/fp'
import Clipboard from '@react-native-clipboard/clipboard'
import { TextHelpers } from 'hylo-shared'
import { useDispatch, useSelector } from 'react-redux'
import useHyloActionSheet from 'hooks/useHyloActionSheet'
import useReactionActions from 'hooks/useReactionActions'
import deleteCommentAction from 'store/actions/deleteComment'
import getGroup from 'store/selectors/getGroup'
import getMe from 'store/selectors/getMe'
import Avatar from 'components/Avatar'
import EmojiRow from 'components/EmojiRow'
import EmojiPicker from 'components/EmojiPicker'
import HyloHTML from 'components/HyloHTML'
import Icon from 'components/Icon'
import styles from './Comment.styles'
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5'
import ImageAttachments from 'components/ImageAttachments'
import { getPresentedPost } from 'store/selectors/getPost'

export default function Comment ({
  comment,
  clearHighlighted,
  commentIdFromParams,
  displayPostTitle,
  showMenu = false,
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
  const { reactOnEntity, removeReactOnFromEntity } = useReactionActions()
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const currentUser = useSelector(getMe)
  const group = useSelector(state => getGroup(state, { slug }))
  const canModerate = currentUser && currentUser.canModerate(group)
  const isCreator = currentUser && (comment.creator.id === currentUser.id)
  const { creator, text, createdAt, post: postId } = comment
  const post = useSelector(state => getPresentedPost(state, { postId, forGroupId: group?.id }))
  const postTitle = displayPostTitle && post?.title && TextHelpers.truncateText(post.title, 40)
  const myReactions = (comment && comment.myReactions) || []
  const myEmojis = myReactions.map((reaction) => reaction.emojiFull)
  const groupIds = post.groups.map(g => g.id)

  const handleReaction = (emojiFull) => reactOnEntity({ commentId: comment?.id, emojiFull, entityType: 'comment', groupIds, postId: post.id }) // TODO: get groupIds to ensure analytics are correct
  const handleRemoveReaction = (emojiFull) => removeReactOnFromEntity({ commentId: comment?.id, emojiFull, entityType: 'comment', postId: post.id })
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
      icon: <Icon name='Replies' style={styles.actionSheetIcon} />
    }],
    ['Copy', handleCopy, {
      icon: <FontAwesome5Icon name='copy' style={styles.actionSheetIcon} />
    }],
    ['Remove', handleRemove, {
      icon: <FontAwesome5Icon name='trash-alt' style={styles.actionSheetIcon} />,
      destructive: true
    }],
    ['Delete', handleDelete, {
      icon: <FontAwesome5Icon name='trash-alt' style={styles.actionSheetIcon} />,
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

  const images = filter({ type: 'image' }, comment?.attachments)
    .map(image => ({ uri: image.url }))

  const handleOnPress = () => {
    if (onPress) return onPress()
    // return handleReply()
  }

  useEffect(() => {
    if (comment && commentIdFromParams === comment.id) {
      scrollTo(0.5)
    }
  }, [])

  return (
    <TouchableOpacity onPress={handleOnPress} onLongPress={showActionSheet}>
      <View style={[styles.container, highlighted && styles.highlighted, style, commentIdFromParams === comment.id && styles.commentIdFromParams]}>
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
            <TouchableOpacity
              style={styles.replyLink}
              hitSlop={{ top: 15, left: 10, bottom: 20, right: 10 }}
              onPress={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              <Icon style={styles.replyLinkIcon} name='Smiley' />
            </TouchableOpacity>
            {handleReply && (
              <TouchableOpacity
                style={styles.replyLink}
                hitSlop={{ top: 15, left: 10, bottom: 20, right: 10 }}
                onPress={handleReply}
              >
                <Icon style={styles.replyLinkIcon} name='Replies' />
              </TouchableOpacity>
            )}
            {(showMenu || isCreator) && (
              <TouchableOpacity
                onPress={showActionSheet}
                hitSlop={{ top: 20, bottom: 10, left: 0, right: 15 }}
              >
                <Icon name='More' style={styles.menuIcon} />
              </TouchableOpacity>
            )}
          </View>
        </View>
        <ImageAttachments
          creator={comment.creator}
          images={images}
          firstImageStyle={styles.imageAttachment}
          title={TextHelpers.presentHTMLToText(comment.text, { truncate: 100 })}
        />
        <View style={styles.body}>
          <HyloHTML html={text} />
          <EmojiRow
            includePicker={false}
            post={post}
            currentUser={currentUser}
            comment={comment}
          />
          {showEmojiPicker ? <EmojiPicker useModal myEmojis={myEmojis} modalOpened={showEmojiPicker} handleReaction={handleReaction} onRequestClose={() => setShowEmojiPicker(!showEmojiPicker)} handleRemoveReaction={handleRemoveReaction} /> : ''}
        </View>
      </View>
    </TouchableOpacity>
  )
}
