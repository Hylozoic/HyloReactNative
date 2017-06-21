import React, { Component } from 'react'
import { View } from 'react-native'
import FeedList from '../FeedList'
// import Loading from 'components/Loading'
import FeedBanner from '../FeedBanner'
// import { ALL_COMMUNITIES_ID } from 'components/FeedList/FeedList.store'
import styles from './Feed.styles'
import { pick, get } from 'lodash/fp'

const ALL_COMMUNITIES_ID = 'all'

export default class Feed extends Component {
  getFeedProps () {
    const { communitySlug, topic } = this.props
    return {
      subject: communitySlug ? 'community' : 'all-communities',
      id: communitySlug || ALL_COMMUNITIES_ID,
      topic: get('id', topic),
      showCommunities: !communitySlug,
      ...pick([
        'filter',
        'sortBy',
        'changeSort',
        'changeTab',
        'showPostDetails',
        'selectedPostId'
      ], this.props)
    }
  }

  render () {
    const { community, currentUser, newPost } = this.props

    return <View style={styles.container}>
      <FeedBanner community={community} currentUser={currentUser}
        all={!community} newPost={newPost} />
      <FeedList {...this.getFeedProps()} />
    </View>
  }
}
