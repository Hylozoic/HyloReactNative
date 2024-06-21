import React, { useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useSelector } from 'react-redux'
import { get } from 'lodash/fp'
import { TextHelpers } from 'hylo-shared'
import usePostActionSheet from 'hooks/usePostActionSheet'
import CondensingBadgeRow from 'components/CondensingBadgeRow'
import getCurrentGroup from 'store/selectors/getCurrentGroup'
import Avatar from 'components/Avatar'
import FlagContent from 'components/FlagContent'
import Icon from 'components/Icon'
import styles, { labelStyles } from './PostHeader.styles'
import { useTranslation } from 'react-i18next'
import { RESP_ADMINISTRATION } from 'store/constants'
import hasResponsibilityForGroup from 'store/selectors/hasResponsibilityForGroup'
import getRolesForGroup from 'store/selectors/getRolesForGroup'

export default function PostHeader ({
  announcement,
  closeOnDelete,
  creator,
  date,
  hideMenu,
  pinned,
  postId,
  showMember,
  smallAvatar,
  style,
  title,
  type
}) {
  const [flaggingVisible, setFlaggingVisible] = useState(false)
  const { showPostActionSheet } = usePostActionSheet({
    postId,
    creator,
    title,
    pinned,
    closeOnDelete,
    setFlaggingVisible
  })
  const currentGroup = useSelector(getCurrentGroup)
  const { avatarUrl, name } = creator
  const handleShowMember = () => showMember && showMember(creator.id)

  const currentGroupId = currentGroup?.id
  const badges = useSelector(state => getRolesForGroup(state, { person: creator, groupId: currentGroupId }))
  const creatorIsSteward = useSelector(state => hasResponsibilityForGroup(state, { person: creator, responsibility: RESP_ADMINISTRATION, groupId: currentGroupId }))
  return (
    <View style={[styles.container, style]}>
      <View style={styles.avatarSpacing}>
        <TouchableOpacity onPress={handleShowMember}>
          {!!avatarUrl && <Avatar avatarUrl={avatarUrl} dimension={smallAvatar ? 24 : 24} />}
        </TouchableOpacity>
      </View>
      <View style={styles.nameAndDate}>
        <TouchableOpacity onPress={handleShowMember}>
          {name && (
            <Text style={styles.name}>{name}</Text>
          )}
        </TouchableOpacity>
        <CondensingBadgeRow badges={badges} creatorIsSteward={creatorIsSteward} currentGroup={currentGroup} postId={postId} />
        <Text style={styles.date}>{TextHelpers.humanDate(date)}</Text>
      </View>
      <View style={styles.upperRight}>
        {pinned && (
          <Icon name='Pin' style={styles.pinIcon} />
        )}
        {announcement && (
          <Icon name='Announcement' style={styles.announcementIcon} />
        )}
        {type && (
          <PostLabel type={type} />
        )}
        {!hideMenu && (
          <TouchableOpacity
            onPress={showPostActionSheet}
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          >
            <Icon name='More' style={styles.moreIcon} />
          </TouchableOpacity>
        )}
        {flaggingVisible && (
          <FlagContent
            type='post'
            linkData={{
              slug: currentGroup?.slug,
              id: postId,
              type: 'post'
            }}
            onClose={() => setFlaggingVisible(false)}
          />
        )}
      </View>
    </View>
  )
}

export function PostLabel ({ type }) {
  const { t } = useTranslation()
  const labelTypeStyle = get(type, labelStyles) || labelStyles.discussion
  const boxStyle = [labelStyles.box, labelTypeStyle.box]
  const textStyle = [labelStyles.text, labelTypeStyle.text]

  // explicit invocations of dynamic content
  t('discussion')
  t('event')
  t('project')
  t('proposal')
  t('offer')
  t('request')
  t('resource')

  return (
    <View style={boxStyle}>
      <Text style={textStyle}>
        {t(type).toUpperCase()}
      </Text>
    </View>
  )
}
