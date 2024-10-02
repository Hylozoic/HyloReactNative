import React, { useState } from 'react'
import { Text, View, Alert, TouchableOpacity } from 'react-native'
import { filter } from 'lodash/fp'
import Clipboard from '@react-native-clipboard/clipboard'
import { TextHelpers } from 'hylo-shared'
import { useDispatch, useSelector } from 'react-redux'
import useHyloActionSheet from 'hooks/useHyloActionSheet'
import useReactOnEntity from 'urql-shared/hooks/useReactOnEntity'
import useCurrentUser from 'urql-shared/hooks/useCurrentUser'
import deleteCommentAction from 'store/actions/deleteComment'
import getGroup from 'store/selectors/getGroup'
import { getPresentedPost } from 'store/selectors/getPost'
import Avatar from 'components/Avatar'
import EmojiRow from 'components/EmojiRow'
import EmojiPicker from 'components/EmojiPicker'
import HyloHTML from 'components/HyloHTML'
import Icon from 'components/Icon'
import styles from './Comment.styles'
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5'
import ImageAttachments from 'components/ImageAttachments'
import { useTranslation } from 'react-i18next'
import hasResponsibilityForGroup from 'store/selectors/hasResponsibilityForGroup'
import { RESP_MANAGE_CONTENT } from 'store/constants'

export default function Comment ({
  comment,
  clearHighlighted,
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
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { showHyloActionSheet } = useHyloActionSheet()
  const { reactOnEntity, removeReactOnFromEntity } = useReactOnEntity()
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const currentUser = useCurrentUser()
  const group = useSelector(state => getGroup(state, { slug }))
  const canModerate = useSelector(state => hasResponsibilityForGroup(state, { responsibility: RESP_MANAGE_CONTENT, groupId: group?.id }))
  const isCreator = currentUser && (comment.creator.id === currentUser.id)
  const { creator, text, createdAt, post: postId } = comment
  const post = useSelector(state => getPresentedPost(state, { postId, forGroupId: group?.id }))
  const postTitle = displayPostTitle && post?.title && TextHelpers.truncateText(post.title, 40)
  const myReactions = (comment && comment.myReactions) || []
  const myEmojis = myReactions.map((reaction) => reaction.emojiFull)
  const groupIds = post?.groups.map(g => g.id)

  const handleReaction = (emojiFull) => reactOnEntity({ commentId: comment?.id, emojiFull, entityType: 'Comment', groupIds, postId: post })
  const handleRemoveReaction = (emojiFull) => removeReactOnFromEntity({ commentId: comment?.id, emojiFull, entityType: 'Comment', postId: post })
  const handleReply = onReply && (() => onReply(comment))
  const handleRemove = (!isCreator && canModerate) && (
    () => Alert.alert(
      t('Moderator: Confirm Delete'),
      t('Are you sure you want to remove this comment?'),
      [
        { text: t('Yes'), onPress: () => dispatch(deleteCommentAction(comment.id)) },
        { text: t('Cancel'), style: 'cancel' }
      ]
    )
  )
  const handleDelete = (isCreator) && (
    () => {
      Alert.alert(
        t('Confirm Delete'),
        t('Are you sure you want to delete this comment?'),
        [
          { text: t('Yes'), onPress: () => dispatch(deleteCommentAction(comment.id)) },
          { text: t('Cancel'), style: 'cancel' }
        ]
      )
    }
  )
  const handleCopy = () => Clipboard.setString(TextHelpers.presentHTMLToText(comment.text))

  const commentMenuActions = [
    [t('Reply'), handleReply, {
      icon: <Icon name='Replies' style={styles.actionSheetIcon} />
    }],
    [t('React'), () => setShowEmojiPicker(!showEmojiPicker), {
      icon: <Icon name='Smiley' style={styles.actionSheetIcon} />
    }],
    [t('Copy'), handleCopy, {
      icon: <FontAwesome5Icon name='copy' style={styles.actionSheetIcon} />
    }],
    [t('Remove'), handleRemove, {
      icon: <FontAwesome5Icon name='trash-alt' style={styles.actionSheetIcon} />,
      destructive: true
    }],
    [t('Delete'), handleDelete, {
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
        if (action[0] !== t('Reply')) clearHighlighted()
      }
    )
  }

  const images = filter({ type: 'image' }, comment?.attachments)
    .map(image => ({ uri: image.url }))

  const handleOnPress = () => {
    if (onPress) return onPress()
    // return handleReply()
  }

  return (
    <TouchableOpacity onPress={handleOnPress} onLongPress={showActionSheet}>
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
              <Text style={styles.date}>{t('on')} "{postTitle}"</Text>
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
          {showEmojiPicker && (
            <EmojiPicker
              useModal
              myEmojis={myEmojis}
              modalOpened={showEmojiPicker}
              handleReaction={handleReaction}
              onRequestClose={() => setShowEmojiPicker(!showEmojiPicker)}
              handleRemoveReaction={handleRemoveReaction}
            />
          )}
        </View>
      </View>
    </TouchableOpacity>
  )
}
