import React from 'react'
import { View, Text } from 'react-native'
import { filter, get, map, find, isEmpty } from 'lodash/fp'

import Avatar from '../Avatar'
import styles from './ThreadCard.styles'
import { humanDate } from 'hylo-utils/text'

export default function ThreadCard (props) {
  const { message, currentUser, participants, isLast, unread } = props
  if (!message) return null
  const otherParticipants = filter(p => p.id !== get('id', currentUser), participants)
  const names = threadNames(map('name', otherParticipants))
  const messageCreatorPrepend = lastMessageCreator(message, currentUser, participants)
  const avatarUrls = isEmpty(otherParticipants)
    ? [get('avatarUrl', currentUser)]
    : map('avatarUrl', otherParticipants)

  return <View style={[styles.threadCard, unread && styles.highlight]}>
    <ThreadAvatars avatarUrls={avatarUrls} />
    <View style={[styles.messageContent, isLast && styles.lastCard]}>
      <Text style={styles.header}>{names}</Text>
      <Text style={styles.body} numberOfLines={2}>{messageCreatorPrepend}{message.text}</Text>
      <Text style={styles.date}>{humanDate(get('createdAt', message))}</Text>
    </View>
  </View>
}

export function lastMessageCreator (message, currentUser, participants) {
  if (get('id', message.creator) === currentUser.id) return 'You: '
  if (participants.length <= 2) return ''
  return find(p => p.id === get('id', message.creator), participants).name + ': '
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

export function ThreadAvatars ({avatarUrls}) {
  const count = avatarUrls.length
  return <View style={styles.threadAvatars}>
    {(count <= 2) && <Avatar avatarUrl={avatarUrls[0]} style={styles.firstThreadAvatar} />}
    {count === 2 && <Avatar avatarUrl={avatarUrls[1]} style={styles.restThreadAvatars} />}
    {count > 2 && <Avatar avatarUrl={avatarUrls[0]} style={styles.firstThreadAvatar} />}
    {count > 2 && <Avatar avatarUrl={avatarUrls[1]} style={styles.restThreadAvatars} />}
    {count > 3 && <View style={styles.count}><Text style={styles.countText}>+{count - 2}</Text></View>}
  </View>
}
