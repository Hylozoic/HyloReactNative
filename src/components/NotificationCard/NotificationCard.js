import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { any, bool, shape, string } from 'prop-types'

import Avatar from '../Avatar'

import styles from './NotificationCard.styles'

export default function NotificationCard ({ notification }) {
  // const { createdAt, creator, text } = notification

  return <View style={styles.container}>
    <Text>NOTIFICATION</Text>
  </View>
}

    // <Avatar avatarUrl={creator.avatarUrl} />
    // <View style={styles.body}>
    //   <Text style={styles.name}>{creator.name}</Text>
    //   <Text style={styles.text}>{text}</Text>
    //   <Text style={styles.date}>{createdAt}</Text>
    // </View>
NotificationCard.propTypes = {
  // notification: shape({
  //   id: any,
  //   createdAt: string,
  //   creator: shape({
  //     id: any,
  //     name: string,
  //     avatarUrl: string
  //   }),
  //   text: string
  // })
}
