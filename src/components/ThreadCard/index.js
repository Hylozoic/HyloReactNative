import React from 'react'
import { View, Text } from 'react-native'
import { filter, get, map } from 'lodash/fp'

import Avatar from '../Avatar'
import styles from './ThreadCard.styles'
import { humanDate } from 'hylo-utils/text'

export default function ThreadCard (props) {
  const otherParticipants = filter(p => p.id !== get('id', props.currentUser), props.participants)
  const names = threadNames(map('name', otherParticipants))
  const avatarUrls = map('avatarUrl', otherParticipants)
  if (!props.message) return null

  return <View style={styles.threadCard}>
    <ThreadAvatars avatarUrls={avatarUrls} />
    <View style={styles.messageContent}>
      <Text style={styles.header}>{names}</Text>
      <Text style={styles.body} numberOfLines={2}>{props.message.text}</Text>
      <Text style={styles.date}>{humanDate(get('createdAt', props.message))}</Text>
    </View>
  </View>
}

export function threadNames (names) {
  let nameString = ''
  switch (names.length) {
    case 1:
    case 2:
      nameString = names.join(', ')
      break
    default:
      nameString = `${names.slice(0, 1).join(', ')} and ${names.length - 1} other${names.length > 2 ? 's' : ''}`
      break
  }
  return nameString
}

export function ThreadAvatars ({avatarUrls}) {
  const count = avatarUrls.length
  return <View style={styles.threadAvatars}>
    {(count <= 2) && <Avatar avatarUrl={avatarUrls[0]} style={styles.firstThreadAvatar} />}
    {count === 2 && <Avatar avatarUrl={avatarUrls[1]} style={styles.restThreadAvatars} />}
    {count > 2 && <Avatar avatarUrl={avatarUrls[0]} style={styles.firstThreadAvatar} />}
    {count > 2 && <Avatar avatarUrl={avatarUrls[1]} style={styles.restThreadAvatars} />}
    {count > 2 && <Avatar avatarUrl={avatarUrls[2]} style={styles.restThreadAvatars} />}
    {count > 3 && <View style={styles.count}><Text style={styles.countText}>+{count - 3}</Text></View>}
  </View>
}
