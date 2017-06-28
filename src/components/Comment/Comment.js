/* eslint-disable camelcase */
import React from 'react'
import { View, Text } from 'react-native'
import Avatar from '../Avatar'
const { func, array } = React.PropTypes
import styles from './Comment.styles'

export default class Comments extends React.Component {
  static propTypes = {
    comment: array,
    fetchComments: func
  }

  render () {
    const {
      comment,
      style
    } = this.props

    const { creator, text } = comment

    return <View style={[style, styles.container]}>
      <Avatar avatarUrl={creator.avatarUrl} style={styles.avatar} />
      <View style={styles.details}>
        <Text style={styles.name}>{creator.name}</Text>
        <Text style={styles.date}>3 hours ago</Text>
        <Text style={styles.text}>{text}</Text>
      </View>
    </View>
  }
}
