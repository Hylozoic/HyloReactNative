import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Share, Alert } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { filter, isEmpty } from 'lodash/fp'
import Clipboard from '@react-native-community/clipboard'
import useHyloActionSheet from 'hooks/useHyloActionSheet'
import getMe from 'store/selectors/getMe'
import getCurrentGroup from 'store/selectors/getCurrentGroup'
import getCanModerate from 'store/selectors/getCanModerate'
import {
  removePost as removePostAction,
  deletePost as deletePostAction,
  pinPost as pinPostAction
} from './usePostActionSheet.store'
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5'
import Icon from 'components/Icon'
import { isContextGroup } from 'store/models/Group'

export default function usePostActionSheet ({
  closeOnDelete,
  creator,
  pinned,
  postId,
  setFlaggingVisible,
  title
}) {
  const navigation = useNavigation()
  const { showHyloActionSheet } = useHyloActionSheet()
  const dispatch = useDispatch()
  const currentGroup = useSelector(getCurrentGroup)
  const currentUser = useSelector(getMe)
  const canModerate = useSelector(getCanModerate)

  const isCreator = currentUser && creator && currentUser.id === creator.id
  const canEdit = isCreator
  const canFlag = !isCreator

  const editPost = canEdit
    ? () => navigation.navigate('Edit Post', { id: postId })
    : null

  const handleDeletePost = canEdit
    ? () => dispatch(deletePostAction(postId))
    : null

  const handleDeletePostAndClose = () => {
    if (canEdit) {
      dispatch(deletePostAction(postId))
      navigation.goBack()
    }
  }

  const handleRemovePost = !isCreator && canModerate && currentGroup && !isContextGroup(currentGroup)
    ? () => dispatch(removePostAction(postId, currentGroup?.slug))
    : null

  const pinPost = canModerate && currentGroup && !isContextGroup(currentGroup)
    ? () => dispatch(pinPostAction(postId, currentGroup.id))
    : null

  const share = () => Share.share({
    message: `"${title}" by ${creator.name} on hylo.com: ${process.env.HYLO_WEB_BASE_URL}/post/${postId}`,
    url: `${process.env.HYLO_WEB_BASE_URL}/post/${postId}`
  }, {
    dialogTitle: `Share "${title}" by ${creator.name}`,
    subject: `"${title}" by ${creator.name} on hylo.com`
  })

  const copyLink = () => Clipboard.setString(`${process.env.HYLO_WEB_BASE_URL}/post/${postId}`)

  const flagPost = canFlag
    ? () => setFlaggingVisible(true)
    : null

  const deletePostWithConfirm = handleDeletePost
    ? () => Alert.alert(
        'Confirm Delete',
        'Are you sure you want to delete this post?',
        [
          {
            text: 'Yes',
            onPress: () => closeOnDelete
              ? handleDeletePostAndClose()
              : handleDeletePost()
          },
          { text: 'Cancel', style: 'cancel' }
        ]
      )
    : null

  const removePostWithConfirm = handleRemovePost
    ? () => Alert.alert(
        'Confirm Removal',
        'Are you sure you want to remove this post from this group?',
        [
          { text: 'Yes', onPress: () => handleRemovePost() },
          { text: 'Cancel', style: 'cancel' }
        ])
    : null

  // const handleCopy = () => Clipboard.setString(TextHelpers.presentHTMLToText(post.details))

  const actionSheetActions = filter(x => x[1], [
    ['Share', share, {
      icon: <FontAwesome5Icon name='share' style={styles.actionSheetIcon} />
    }],
    ['Copy Link', copyLink, {
      icon: <Icon name='Copy' style={styles.actionSheetIcon} />
    }],
    ['Edit', editPost, {
      icon: <FontAwesome5Icon name='pencil-alt' style={styles.actionSheetIcon} />
    }],
    ['Flag', flagPost, {
      icon: <FontAwesome5Icon name='flag' style={styles.actionSheetIcon} />,
      destructive: true
    }],
    [pinned ? 'Unpin' : 'Pin', pinPost, {
      icon: <Icon name='Pin' style={[styles.actionSheetIcon, { fontSize: 30 }]} />
    }],
    ['Remove From Group', removePostWithConfirm, {
      icon: <FontAwesome5Icon name='trash-alt' style={styles.actionSheetIcon} />,
      destructive: true
    }],
    ['Delete', deletePostWithConfirm, {
      icon: <FontAwesome5Icon name='trash-alt' style={styles.actionSheetIcon} />,
      destructive: true
    }]
  ])

  return {
    showPostActionSheet: () => !isEmpty(actionSheetActions) && showHyloActionSheet({ actions: actionSheetActions })
  }
}

const styles = {
  actionSheetIcon: {
    fontSize: 20
  }
}
