import React from 'react'
import HTMLView from 'react-native-htmlview'
import { StyleSheet, Text, View } from 'react-native'
import { present, sanitize } from 'hylo-utils/text'
import { any, bool, shape, string } from 'prop-types'
import urlHandler from '../../util/urlHandler'

import Avatar from '../Avatar'

import styles from './MessageCard.style'

export default function MessageCard ({ message }) {
  const { createdAt, creator, suppressCreator, suppressDate, text, showTopic, showMember } = message

  const presentedText = present(
    sanitize(text).replace(/\n/g, '').replace('<p>&nbsp;</p>', ''))

  const textStyles = [ styles.text, suppressCreator && styles.marginTopNoCreator ]

  return <View style={[ styles.container, suppressCreator && styles.padLeftNoAvatar ]}>
    {!suppressCreator && <Avatar avatarUrl={creator.avatarUrl} />}
    <View style={[ styles.body, suppressCreator && styles.padTopNoCreator ]}>
      {!suppressCreator && <Text style={styles.name}>{creator.name}</Text>}
      <HTMLView
        onLinkPress={url => urlHandler(url, showMember, showTopic)}
        addLineBreaks={false}
        stylesheet={richTextStyles}
        textComponentProps={{ style: textStyles }}
        value={presentedText} />
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

// TODO: remove duplication between here and PostBody

const richTextStyles = StyleSheet.create({
  a: {
    color: '#0DC39F'
  }
})
