/* eslint-disable camelcase */
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import HTMLView from 'react-native-htmlview'
import Avatar from '../Avatar'
import { object } from 'prop-types'
import styles from './Comment.styles'
import { present, sanitize, humanDate } from 'hylo-utils/text'
import { get } from 'lodash/fp'

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
      style,
      displayPostTitle
    } = this.props

    const { creator, text, createdAt, post } = comment
    const presentedText = present(sanitize(text), {slug})

    var postTitle = get('title', post)
    if (displayPostTitle && postTitle) {
      postTitle = postTitle.length > 40
        ? postTitle.substring(0, 40) + '...'
        : postTitle
    }

    return <View style={[style, styles.container]}>
      <Avatar avatarUrl={creator.avatarUrl} style={styles.avatar} />
      <View style={styles.details}>
        <View style={styles.header}>
          <Text style={styles.name}>{creator.name}</Text>
          <Text style={styles.date}>{humanDate(createdAt)}</Text>
          {displayPostTitle && <Text style={styles.date}>on "{postTitle}"</Text>}
        </View>
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
