import React, { Component } from 'react'
import { View } from 'react-native'
import FeedList from '../FeedList'
import FeedBanner from '../FeedBanner'
import styles from './Feed.styles'

export default class Feed extends Component {
  render () {
    const { community, currentUser, newPost, navigation } = this.props

    const showPost = id =>
      navigation.navigate('PostDetails', {id})

    return <View style={styles.container}>
      <FeedList
        community={community}
        showPost={showPost}
        header={
          <FeedBanner community={community} currentUser={currentUser}
            all={!community} newPost={newPost} />
        } />
    </View>
  }
}
