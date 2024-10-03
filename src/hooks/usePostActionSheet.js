import { Alert } from 'react-native'
import Config from 'react-native-config'
import { useDispatch, useSelector } from 'react-redux'
import Share from 'react-native-share'
import { useNavigation } from '@react-navigation/native'
import { filter, isEmpty } from 'lodash/fp'
import Clipboard from '@react-native-clipboard/clipboard'
import { AnalyticsEvents } from 'hylo-shared'
import useHyloActionSheet from 'hooks/useHyloActionSheet'
import useMixpanelTrack from 'hooks/useMixpanelTrack'
import getMe from 'store/selectors/getMe'
import getCurrentGroup from 'store/selectors/getCurrentGroup'
import {
  removePost as removePostAction,
  deletePost as deletePostAction,
  pinPost as pinPostAction
} from './usePostActionSheet.store'
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5'
import Icon from 'components/Icon'
import { isContextGroup } from 'store/models/Group'
import { postUrl as postUrlCreator } from 'util/navigation'
import { useTranslation } from 'react-i18next'
import hasResponsibilityForGroup from 'store/selectors/hasResponsibilityForGroup'
import { RESP_MANAGE_CONTENT } from 'store/constants'

export default function usePostActionSheet ({
  baseHostURL = Config.HYLO_WEB_BASE_URL,
  closeOnDelete,
  creator,
  pinned,
  postId,
  setFlaggingVisible,
  title
}) {
  const { t } = useTranslation()
  const navigation = useNavigation()
  const { showHyloActionSheet } = useHyloActionSheet()
  const mixpanelTrack = useMixpanelTrack()
  const dispatch = useDispatch()
  const currentGroup = useSelector(getCurrentGroup)
  const currentUser = useSelector(getMe)
  const canModerate = useSelector(state => hasResponsibilityForGroup(state, { responsibility: RESP_MANAGE_CONTENT, groupId: currentGroup?.id }))
  const createActionSheetActions = () => {
    const isCreator = currentUser && creator && currentUser.id === creator.id
    const postUrl = isContextGroup(currentGroup?.slug)
      ? postUrlCreator(postId, { context: currentGroup?.slug })
      : postUrlCreator(postId, { groupSlug: currentGroup?.slug })
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

    const handleRemovePost = currentGroup && !isCreator && canModerate && !isContextGroup(currentGroup.slug)
      ? () => dispatch(removePostAction(postId, currentGroup?.slug))
      : null

    const pinPost = currentGroup && canModerate && !isContextGroup(currentGroup).slug
      ? () => dispatch(pinPostAction(postId, currentGroup.id))
      : null

    const share = async () => {
      try {
        await Share.open({
          message: t('shareMessage', { title, name: creator.name, url: `${baseHostURL}${postUrl}` })
          // Used only by iOS and will repeat the URL in some contexts if we also include
          // it in the message. Refine this area as later effort.
          // url: `${baseHostURL}${postUrl}`
        }, {
          dialogTitle: t('shareDialogTitle', { title, name: creator.name }),
          subject: t('shareSubject', { title, name: creator.name })
        })

        mixpanelTrack(AnalyticsEvents.POST_SHARED)
      } catch (e) {
        console.log(e)
      }
    }

    const copyLink = () => Clipboard.setString(`${baseHostURL}${postUrl}`)

    const flagPost = !isCreator
      ? () => setFlaggingVisible(true)
      : null

    const deletePostWithConfirm = handleDeletePost
      ? () => Alert.alert(
          t('Confirm Delete'),
          t('Are you sure you want to delete this post?'),
          [
            {
              text: t('Yes'),
              onPress: () => closeOnDelete
                ? handleDeletePostAndClose()
                : handleDeletePost()
            },
            { text: t('Cancel'), style: 'cancel' }
          ]
        )
      : null

    const removePostWithConfirm = handleRemovePost
      ? () => Alert.alert(
          t('Confirm Removal'),
          t('Are you sure you want to remove this post from this group?'),
          [
            { text: t('Yes'), onPress: () => handleRemovePost() },
            { text: t('Cancel'), style: 'cancel' }
          ])
      : null

    // const handleCopy = () => Clipboard.setString(TextHelpers.presentHTMLToText(post.details))

    /*

      Action menu items are defined as:

      `['Label', action, { icon, destructive }]`

      The action is excluded from the menu if the `action` param is falsy.

    */
    return filter(x => x[1], [
      [t('Edit'), editPost, {
        icon: <FontAwesome5Icon name='pencil-alt' style={styles.actionSheetIcon} />
      }],
      [t('Delete'), deletePostWithConfirm, {
        icon: <FontAwesome5Icon name='trash-alt' style={styles.actionSheetIcon} />,
        destructive: true
      }],
      [pinned ? t('Unpin') : t('Pin'), pinPost, {
        icon: <Icon name='Pin' style={[styles.actionSheetIcon, { fontSize: 30 }]} />
      }],
      [t('Remove From Group'), removePostWithConfirm, {
        icon: <FontAwesome5Icon name='trash-alt' style={styles.actionSheetIcon} />,
        destructive: true
      }],
      [t('Share'), share, {
        icon: <FontAwesome5Icon name='share' style={styles.actionSheetIcon} />
      }],
      [t('Copy Link'), copyLink, {
        icon: <Icon name='Copy' style={styles.actionSheetIcon} />
      }],
      [t('Flag'), flagPost, {
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
