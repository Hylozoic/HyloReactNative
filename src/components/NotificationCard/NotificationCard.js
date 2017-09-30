import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { any, bool, shape, string } from 'prop-types'

import Avatar from '../Avatar'

import styles from './NotificationCard.styles'

const renderName = ({ actor, nameInHeader }) =>
  nameInHeader ? <Text style={styles.name}>{`${actor.name} `}</Text> : null

const renderTitle = title => title ? <Text>{` ${title}`}</Text> : null

export default function NotificationCard ({ notification }) {
  const { actor, body, createdAt, header, title } = notification

  return <View style={styles.container}>
    <Avatar avatarUrl={actor.avatarUrl} style={styles.avatar} />
    <View style={styles.content}>
      <View style={styles.header}>
        {renderName(notification)}
        <Text style={styles.text}>{header}</Text>
        {renderTitle(title)}
      </View>
      <Text style={styles.text} numberOfLines={2}>
        <Text style={styles.name}>{`${actor.name} `}</Text>
        {body}
      </Text>
      <Text>{createdAt}</Text>
    </View>
  </View>
}

    // <Avatar avatarUrl={creator.avatarUrl} />
    // <View style={styles.body}>
    //   <Text style={styles.name}>{creator.name}</Text>
    //   <Text style={styles.text}>{text}</Text>
    //   <Text style={styles.date}>{createdAt}</Text>
    // </View>
NotificationCard.propTypes = {
  notification: shape({
    id: any,
    activityId: any,
    actor: shape({
      name: string,
      avatarUrl: string
    }),
    createdAt: string,
    body: string,
    header: string,
    nameInHeader: bool,
    title: string,
    unread: bool
  })
}



// import styles from './ThreadCard.styles'
// import { humanDate } from 'hylo-utils/text'
//
// export default function ThreadCard (props) {
//   const otherParticipants = filter(p => p.id !== get('id', props.currentUser), props.participants)
//   const names = threadNames(map('name', otherParticipants))
//   const avatarUrls = map('avatarUrl', otherParticipants)
//   if (!props.message) return null
//
//   return <View style={styles.threadCard}>
//     <ThreadAvatars avatarUrls={avatarUrls} />
//     <View style={styles.messageContent}>
//       <Text style={styles.header}>{names}</Text>
//       <Text style={styles.body} numberOfLines={2}>{props.message.text}</Text>
//       <Text>{humanDate(get('createdAt', props.message))}</Text>
//     </View>
//   </View>
// }
//
// export function threadNames (names) {
//   let nameString = ''
//   switch (names.length) {
//     case 1:
//     case 2:
//       nameString = names.join(', ')
//       break
//     default:
//       nameString = `${names.slice(0, 1).join(', ')} and ${names.length - 1} other${names.length > 2 ? 's' : ''}`
//       break
//   }
//   return nameString
// }
//
// export function ThreadAvatars ({avatarUrls}) {
//   const count = avatarUrls.length
//   return <View>
//     {(count <= 2) && <Avatar avatarUrl={avatarUrls[0]} style={styles.firstThreadAvatar} />}
//     {count === 2 && <Avatar avatarUrl={avatarUrls[1]} style={styles.threadAvatars} />}
//     {count > 2 && <Avatar avatarUrl={avatarUrls[0]} style={styles.firstThreadAvatar} />}
//     {count > 2 && <Avatar avatarUrl={avatarUrls[1]} style={styles.threadAvatars} />}
//     {count > 2 && <Avatar avatarUrl={avatarUrls[2]} style={styles.threadAvatars} />}
//     {count > 3 && <View style={styles.count}><Text style={styles.countText}>+{count - 3}</Text></View>}
//   </View>
