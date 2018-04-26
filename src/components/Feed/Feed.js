import React from 'react'
import { View } from 'react-native'
import { get } from 'lodash/fp'

import FeedList from '../FeedList'
import FeedBanner from '../FeedBanner'
import SocketSubscriber from '../SocketSubscriber'
import styles from './Feed.styles'

export default class Feed extends React.Component {
  state = {showNotification: false}

  static navigationOptions = ({ navigation }) => {
    const topicName = get('state.params.topicName', navigation)
    const communityName = get('state.params.communityName', navigation)
    return {
      headerTitle: topicName ? communityName : 'Home'
    }
  }

  componentDidMount () {
    if (this.props.community) this.props.navigation.setParams({communityName: this.props.community.name})
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
      goToCommunity,
      navigation,
      newPost,
      showMember,
      showPost,
      showTopic,
      screenProps,
      setTopicSubscribe,
      topicName,
      topicSubscribed,
      postsTotal,
      followersTotal
    } = this.props

    return <View style={styles.container}>
      <FeedList
        community={community}
        network={network}
        showPost={showPost}
        goToCommunity={goToCommunity}
        header={
          <FeedBanner
            community={community}
            network={network}
            currentUser={currentUser}
            all={!community && !topicName}
            newPost={newPost}
            topicName={topicName}
            postsTotal={postsTotal}
            followersTotal={followersTotal}
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
