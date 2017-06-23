import React, { Component } from 'react'
import { View } from 'react-native'
import FeedList from '../FeedList'
import FeedBanner from '../FeedBanner'
import styles from './Feed.styles'

export default class Feed extends Component {
  render () {
    const { community, currentUser, newPost } = this.props

    return <View style={styles.container}>
      <FeedBanner community={community} currentUser={currentUser}
        all={!community} newPost={newPost} />
      <FeedList community={community} />
    </View>
  }
}
