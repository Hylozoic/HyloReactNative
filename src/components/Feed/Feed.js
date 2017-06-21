import React, { Component } from 'react'
import { View, Text } from 'react-native'
// import FeedList from 'components/FeedList'
// import Loading from 'components/Loading'
import FeedBanner from '../FeedBanner'
// import TopicFeedHeader from 'components/TopicFeedHeader'
// import { ALL_COMMUNITIES_ID } from 'components/FeedList/FeedList.store'
import styles from './Feed.styles'
import { pick, get } from 'lodash/fp'

const ALL_COMMUNITIES_ID = 'all'

const FeedList = () => {
  return <View>
    <Text>
      Feed List
    </Text>
  </View>
}

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

/*

const ALL_COMMUNITIES_ID = 'all'

const TopicFeedHeader = () => {
  return <View>TopicFeedHeader</View>
}

const FeedList = () => {
  return <View>FeedList</View>
}

const Loading = () => {
  return <View>SLoading</View>
}

const FeedBanner = () => {
  return <View>FeedBanner</View>
}

import { get, pick } from 'lodash/fp'

export default class Feed extends Component {
  static propTypes = {
    newPost: PropTypes.func
  }

  componentDidMount () {
    const { topicName, fetchTopic } = this.props
    if (topicName) fetchTopic()
  }

  componentDidUpdate (prevProps) {
    const { communitySlug, topicName, fetchTopic } = this.props
    const topicChanged = topicName && get('topicName', prevProps) !== topicName
    const slugChanged = communitySlug && get('communitySlug', prevProps) !== communitySlug
    if (topicChanged || (topicName && slugChanged)) fetchTopic()
  }

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
    const {
      topic, community, currentUser, topicName, postsTotal, followersTotal,
      communityTopic, newPost
    } = this.props

    if (topicName && !topic) return <Loading />
    if (community && topicName && !communityTopic) return <Loading />

    return <View>
      {topicName
        ? <TopicFeedHeader
          communityTopic={communityTopic}
          topicName={topicName}
          postsTotal={postsTotal}
          followersTotal={followersTotal}
          topic={topic}
          community={community} />
        : <FeedBanner community={community} currentUser={currentUser}
          all={!community} newPost={newPost} />}
      <FeedList {...this.getFeedProps()} />
    </View>
  }
}

*/
