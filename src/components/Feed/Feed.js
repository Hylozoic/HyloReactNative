import React, { Component } from 'react'
import { View } from 'react-native'
import { get } from 'lodash/fp'
import { withNavigationFocus } from 'react-navigation-is-focused-hoc'

import FeedList from '../FeedList'
import FeedBanner from '../FeedBanner'
import SocketSubscriber from '../SocketSubscriber'
import styles from './Feed.styles'

export class Feed extends Component {
  state = {showNotification: false}

  static navigationOptions = ({ navigation }) => {
    const topicName = get('state.params.topicName', navigation)
    return {
      headerTitle: topicName ? '#' + topicName : 'Home'
    }
  }

  componentDidMount () {
    const { fetchCommunityTopic } = this.props
    if (fetchCommunityTopic) fetchCommunityTopic()
  }

  shouldComponentUpdate (nextProps) {
    return nextProps.isFocused
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
      screenProps,
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
        screenProps={screenProps}
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
      {!topicName && community && <SocketSubscriber type='community' id={community.id} />}
    </View>
  }
}

export default withNavigationFocus(Feed)
