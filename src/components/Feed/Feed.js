import React, { Component } from 'react'
import { View } from 'react-native'
import FeedList from '../FeedList'
import Loading from '../Loading'
import FeedBanner from '../FeedBanner'
import styles from './Feed.styles'

export default class Feed extends Component {
  render () {
    const { community, currentUser, newPost, showPost, editPost } = this.props
    if (!currentUser) return <Loading style={{flex: 1}} />

    return <View style={styles.container}>
      <FeedList
        community={community}
        showPost={showPost}
        editPost={editPost}
        header={
          <FeedBanner community={community} currentUser={currentUser}
            all={!community} newPost={newPost} />
        } />
    </View>
  }
}
