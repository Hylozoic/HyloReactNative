import React, { Component } from 'react'
import { View } from 'react-native'
import FeedList from '../FeedList'
import FeedBanner from '../FeedBanner'
import styles from './Feed.styles'
import { get } from 'lodash/fp'
import NotificationOverlay from '../NotificationOverlay'

export default class Feed extends Component {
  state = {showNotification: false}

  static navigationOptions = ({ navigation }) => {
    const topicName = get('state.params.topicName', navigation)
    return {
      headerTitle: topicName ? '#' + topicName : 'Home'
    }
  }

  componentDidMount () {
    const { fetchTopic } = this.props
    if (fetchTopic) fetchTopic()
  }

  render () {
    const {
      community,
      currentUser,
      newPost,
      showPost,
      editPost,
      showMember,
      showTopic,
      goToCommunity,
      topicName,
      topicSubscribed,
      toggleTopicSubscribe
    } = this.props

    return <View style={styles.container}>
      <FeedList
        community={community}
        showPost={showPost}
        editPost={editPost}
        showMember={showMember}
        showTopic={showTopic}
        showCommunities={!community}
        goToCommunity={goToCommunity}
        topicName={topicName}
        header={
          <FeedBanner
            community={community}
            currentUser={currentUser}
            all={!community}
            newPost={newPost}
            topicName={topicName}
            topicSubscribed={topicSubscribed}
            toggleTopicSubscribe={toggleTopicSubscribe} />
        } />
      {!!this.state.showNotification &&
        <NotificationOverlay message='hello topic' />}
    </View>
  }
}
