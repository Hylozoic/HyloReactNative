import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { any, bool, shape, string } from 'prop-types'

import Avatar from '../Avatar'

import styles from './MessageCard.style'

export default function MessageCard ({ message }) {
  const { createdAt, creator, suppressCreator, suppressDate, text } = message
  const bodyStyle = {
    flexDirection: 'column',
    flex: 0.9,
    paddingLeft: suppressCreator ? 44 : 10
  }
  const containerStyle = {
    flexDirection: 'row',
    paddingBottom: 5,
    paddingHorizontal: 10,
    paddingTop: suppressCreator ? 0 : 5,
    backgroundColor: 'white',

    // Prevents the card from appearing upside down in the inverted FlatList
    transform: [{ scaleY: -1 }]
  }

  return <View style={containerStyle}>
    {!suppressCreator && <Avatar avatarUrl={creator.avatarUrl} />}
    <View style={bodyStyle}>
      {!suppressCreator && <Text style={styles.name}>{creator.name}</Text>}
      <Text style={styles.text}>{text}</Text>
      {!suppressDate && <Text style={styles.date}>{createdAt}</Text>}
    </View>
  </View>
}

MessageCard.propTypes = {
  message: shape({
    id: any,
    createdAt: string,
    creator: shape({
      id: any,
      name: string,
      avatarUrl: string
    }),
    suppressCreator: bool,
    suppressDate: bool,
    text: string
  })
}
