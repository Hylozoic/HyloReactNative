import React from 'react'
import { Text, View } from 'react-native'
import { any, bool, shape, string } from 'prop-types'

import Avatar from '../Avatar'

import styles from './MessageCard.style'

export default function MessageCard ({ message }) {
  const { createdAt, creator, suppressCreator, suppressDate, text } = message

  return <View style={[ styles.container, suppressCreator && styles.padLeftNoAvatar ]}>
    {!suppressCreator && <Avatar avatarUrl={creator.avatarUrl} />}
    <View style={[ styles.body, suppressCreator && styles.padTopNoCreator ]}>
      {!suppressCreator && <Text style={styles.name}>{creator.name}</Text>}
      <Text style={[ styles.text, suppressCreator && styles.marginTopNoCreator ]}>{text}</Text>
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
