import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { any, func, object, shape, string } from 'prop-types'

import Avatar from '../Avatar'

import styles from './MessageCard.style'

export default function MessageCard ({ message }) {
  return <View style={styles.container}>
    <Avatar avatarUrl={message.creator.avatarUrl}/>
    <View style={styles.body}>
      <Text style={styles.name}>{message.creator.name}</Text>
      <Text style={styles.text}>{message.text}</Text>
      <Text style={styles.date}>{message.createdAt}</Text>
    </View>
  </View>
}

MessageCard.propTypes = {
  message: shape({
    id: any,
    createdAt: string,
    text: string,
    creator: shape({
      id: any,
      name: string,
      avatarUrl: string
    })
  })
}
