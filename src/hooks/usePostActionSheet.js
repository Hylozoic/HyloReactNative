import React, { useCallback } from 'react'
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
import { postUrl as postUrlCreator } from 'util/navigation'

export default function usePostActionSheet ({
  baseHostURL = process.env.HYLO_WEB_BASE_URL,
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

  const createActionSheetActions = () => {
    const isCreator = currentUser && creator && currentUser.id === creator.id
    const postUrl = isContextGroup(currentGroup)
      ? postUrlCreator(postId, { context: currentGroup.slug })
      : postUrlCreator(postId, { groupSlug: currentGroup.slug })

    const editPost = isCreator
      ? () => navigation.navigate('Edit Post', { id: postId })
      : null

    const handleDeletePost = isCreator
      ? () => dispatch(deletePostAction(postId))
      : null

    const handleDeletePostAndClose = () => {
      if (isCreator) {
        dispatch(deletePostAction(postId))
        navigation.goBack()
      }
    }

    const handleRemovePost = currentGroup && !isCreator && canModerate && !isContextGroup(currentGroup)
      ? () => dispatch(removePostAction(postId, currentGroup?.slug))
      : null

    const pinPost = currentGroup && canModerate && !isContextGroup(currentGroup)
      ? () => dispatch(pinPostAction(postId, currentGroup.id))
      : null

    const share = () => Share.share({
      message: `"${title}" by ${creator.name} on hylo.com: ${baseHostURL}${postUrl}`,
      url: `${baseHostURL}${postUrl}`
    }, {
      dialogTitle: `Share "${title}" by ${creator.name}`,
      subject: `"${title}" by ${creator.name} on hylo.com`
    })

    const copyLink = () => Clipboard.setString(`${baseHostURL}${postUrl}`)

    const flagPost = !isCreator
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

    /*

      Action menu items are defined as:

      `['Label', action, { icon, destructive }]`

      The action is excluded from the menu if the `action` param is falsy.

    */
    return filter(x => x[1], [
      ['Edit', editPost, {
        icon: <FontAwesome5Icon name='pencil-alt' style={styles.actionSheetIcon} />
      }],
      ['Delete', deletePostWithConfirm, {
        icon: <FontAwesome5Icon name='trash-alt' style={styles.actionSheetIcon} />,
        destructive: true
      }],
      [pinned ? 'Unpin' : 'Pin', pinPost, {
        icon: <Icon name='Pin' style={[styles.actionSheetIcon, { fontSize: 30 }]} />
      }],
      ['Remove From Group', removePostWithConfirm, {
        icon: <FontAwesome5Icon name='trash-alt' style={styles.actionSheetIcon} />,
        destructive: true
      }],
      ['Share', share, {
        icon: <FontAwesome5Icon name='share' style={styles.actionSheetIcon} />
      }],
      ['Copy Link', copyLink, {
        icon: <Icon name='Copy' style={styles.actionSheetIcon} />
      }],
      ['Flag', flagPost, {
        icon: <FontAwesome5Icon name='flag' style={styles.actionSheetIcon} />,
        destructive: true
      }]
    ])
  }

  return {
    showPostActionSheet: () => {
      const actionSheetActions = createActionSheetActions()

      return !isEmpty(actionSheetActions) && showHyloActionSheet({ actions: actionSheetActions })
    }
  }
}

const styles = {
  actionSheetIcon: {
    fontSize: 20
  }
}
