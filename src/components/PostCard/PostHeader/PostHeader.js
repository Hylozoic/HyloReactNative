import React, { useState } from 'react'
import { View, Text, TouchableOpacity, FlatList } from 'react-native'
import { useSelector } from 'react-redux'
import { get, isEmpty } from 'lodash/fp'
import { TextHelpers } from 'hylo-shared'
import usePostActionSheet from 'hooks/usePostActionSheet'
import getCurrentGroup from 'store/selectors/getCurrentGroup'
import Avatar from 'components/Avatar'
import FlagContent from 'components/FlagContent'
import Icon from 'components/Icon'
import styles, { labelStyles } from './PostHeader.styles'

export default function PostHeader ({
  announcement,
  closeOnDelete,
  creator,
  date,
  hideDateRow,
  hideMenu,
  pinned,
  postId,
  showMember,
  showTopic,
  smallAvatar,
  title,
  topics,
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

  const { avatarUrl, name, tagline } = creator

  const handleShowMember = () => showMember && showMember(creator.id)

  const showTopics = !isEmpty(topics)

  // Used to generate a link to this post from the backend.
  const linkData = {
    slug: currentGroup?.slug,
    id: postId,
    type: 'post'
  }

  return (
    <View style={styles.container}>
      <View style={styles.avatarSpacing}>
        <TouchableOpacity onPress={handleShowMember}>
          {!!avatarUrl && <Avatar avatarUrl={avatarUrl} dimension={smallAvatar && 20} />}
        </TouchableOpacity>
      </View>
      <View style={styles.meta}>
        <TouchableOpacity onPress={handleShowMember}>
          {name && (
            <Text style={styles.username}>{name}</Text>
          )}
          {!!tagline && (
            <Text style={styles.metaText}>{tagline}</Text>
          )}
        </TouchableOpacity>
        {!hideDateRow && (
          <View style={styles.dateRow}>
            <Text style={styles.metaText}>{TextHelpers.humanDate(date)}</Text>
            {!!showTopics && (
              <FlatList
                data={topics}
                style={styles.topicList}
                horizontal
                keyExtractor={item => item.id}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => showTopic && showTopic(item.name)}>
                    <Text style={styles.topicLabel}>#{item.name}</Text>
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        )}
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
            linkData={linkData}
            onClose={() => this.setState({ flaggingVisible: false })}
          />
        )}
      </View>
    </View>
  )
}

export function PostLabel ({ type }) {
  const labelTypeStyle = get(type, labelStyles) || labelStyles.discussion
  const boxStyle = [labelStyles.box, labelTypeStyle.box]
  const textStyle = [labelStyles.text, labelTypeStyle.text]
  return (
    <View style={boxStyle}>
      <Text style={textStyle}>
        {type.toUpperCase()}
      </Text>
    </View>
  )
}
