import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { any, bool, shape, string } from 'prop-types'

import Avatar from '../Avatar'

import styles from './NotificationCard.styles'

export default function NotificationCard ({ notification }) {
  const { actor, createdAt } = notification
  return <View style={styles.container}>
    <Text>{actor ? actor.name : ''}</Text>
    <Text>{createdAt}</Text>
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
