import React from 'react'
import { View, Text } from 'react-native'
import { filter, get, map, find, isEmpty } from 'lodash/fp'
import { TextHelpers } from 'hylo-shared'
import Avatar from 'components/Avatar'
import styles from './ThreadCard.styles'

const MAX_THREAD_PREVIEW_LENGTH = 54

export default function ThreadCard (props) {
  if (!props?.message) return null

  const { message, currentUser, participants, isLast, unread } = props
  const latestMessagePreview = TextHelpers.presentHTMLToText(message?.text, {
    truncate: MAX_THREAD_PREVIEW_LENGTH
  })
  const otherParticipants = filter(p => p.id !== get('id', currentUser), participants)
  const names = threadNames(map('name', otherParticipants))
  const messageCreatorPrepend = lastMessageCreator(message, currentUser, participants)
  const avatarUrls = isEmpty(otherParticipants)
    ? [get('avatarUrl', currentUser)]
    : map('avatarUrl', otherParticipants)

  return (
    <View style={[styles.threadCard, unread && styles.highlight]}>
      <ThreadAvatars avatarUrls={avatarUrls} />
      <View style={[styles.messageContent, isLast && styles.lastCard]}>
        <Text style={styles.header}>{names}</Text>
        <Text style={styles.body} numberOfLines={2}>{messageCreatorPrepend}{latestMessagePreview}</Text>
        <Text style={styles.date}>{TextHelpers.humanDate(message?.createdAt)}</Text>
      </View>
    </View>
  )
}

export function lastMessageCreator (message, currentUser, participants) {
  if (get('id', message.creator) === currentUser.id) return 'You: '
  if (participants.length <= 2) return ''
  return find(p => p.id === get('id', message.creator), participants)?.name || 'Deleted User' + ': '
}

export function threadNames (names) {
  const l = names.length
  switch (l) {
    case 0:
      return 'You'
    case 1:
    case 2:
      return names.join(', ')
    default:
      return `${names.slice(0, 1).join(', ')} and ${l - 1} other${l > 2 ? 's' : ''}`
  }
}

export function ThreadAvatars ({ avatarUrls }) {
  const count = avatarUrls.length
  return (
    <View style={styles.threadAvatars}>
      {(count <= 2) && <Avatar avatarUrl={avatarUrls[0]} style={styles.firstThreadAvatar} />}
      {count === 2 && <Avatar avatarUrl={avatarUrls[1]} style={styles.restThreadAvatars} />}
      {count > 2 && <Avatar avatarUrl={avatarUrls[0]} style={styles.firstThreadAvatar} />}
      {count > 2 && <Avatar avatarUrl={avatarUrls[1]} style={styles.restThreadAvatars} />}
      {count > 3 && <View style={styles.count}><Text style={styles.countText}>+{count - 2}</Text></View>}
    </View>
  )
}
