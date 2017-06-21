import React, { Component } from 'react'
import { View } from 'react-native'
import FeedList from '../FeedList'
// import Loading from 'components/Loading'
import FeedBanner from '../FeedBanner'
// import { ALL_COMMUNITIES_ID } from 'components/FeedList/FeedList.store'
import styles from './Feed.styles'

export default class Feed extends Component {
  render () {
    const { community, currentUser, newPost } = this.props

    return <View style={styles.container}>
      <FeedBanner community={community} currentUser={currentUser}
        all={!community} newPost={newPost} />
      <FeedList />
    </View>
  }
}
