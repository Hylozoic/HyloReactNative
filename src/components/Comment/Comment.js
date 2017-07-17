/* eslint-disable camelcase */
import React from 'react'
import { Linking, StyleSheet, Text, View } from 'react-native'
import HTMLView from 'react-native-htmlview'
import Avatar from '../Avatar'
import { object } from 'prop-types'
import styles from './Comment.styles'
import { present, sanitize } from 'hylo-utils/text'
import urlHandler from '../../util/urlHandler'

export default class Comment extends React.Component {
  static propTypes = {
    comment: object
  }

  render () {
    const {
      comment,
      showMember,
      showTopic,
      slug,
      style
    } = this.props

    const { creator, text } = comment
    const presentedText = present(sanitize(text), {slug})

    return <View style={[style, styles.container]}>
      <Avatar avatarUrl={creator.avatarUrl} style={styles.avatar} />
      <View style={styles.details}>
        <Text style={styles.name}>{creator.name}</Text>
        <Text style={styles.date}>3 hours ago</Text>
        <HTMLView
          onLinkPress={url => urlHandler(url, showMember, showTopic, slug)}
          stylesheet={richTextStyles}
          textComponentProps={{ style: styles.text }}
          value={presentedText} />
      </View>
    </View>
  }
}

const richTextStyles = StyleSheet.create({
  a: {
    color: '#0DC39F'
  }
})
