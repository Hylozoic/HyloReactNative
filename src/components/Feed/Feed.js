import React, { Component } from 'react'
import { View } from 'react-native'
import { get } from 'lodash/fp'

import FeedList from '../FeedList'
import FeedBanner from '../FeedBanner'
import SocketSubscriber from '../SocketSubscriber'
import styles from './Feed.styles'

export default class Feed extends Component {
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
      network,
      currentUser,
      editPost,
      goToCommunity,
      navigation,
      newPost,
      showMember,
      showPost,
      showTopic,
      screenProps,
      setTopicSubscribe,
      topicName,
      topicSubscribed
    } = this.props
    return <View style={styles.container}>
      <FeedList
        community={community}
        network={network}
        showPost={showPost}
        editPost={editPost}
        goToCommunity={goToCommunity}
        header={
          <FeedBanner
            community={community}
            network={network}
            currentUser={currentUser}
            all={!community}
            newPost={newPost}
            topicName={topicName}
            topicSubscribed={topicSubscribed}
            setTopicSubscribe={setTopicSubscribe} />}
        navigation={navigation}
        screenProps={screenProps}
        showCommunities={!community}
        showMember={showMember}
        showTopic={showTopic}
        topicName={topicName} />
      {!topicName && community && <SocketSubscriber type='community' id={community.id} />}
    </View>
  }
}
