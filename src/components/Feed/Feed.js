import React, { Component } from 'react'
import { View, Text, Image } from 'react-native'
import { get } from 'lodash/fp'

import Button from '../Button'
import FeedList from '../FeedList'
import FeedBanner from '../FeedBanner'
import SocketSubscriber from '../SocketSubscriber'
import styles from './Feed.styles'

const axolotlImage = require('../../assets/hey-axolotl.png')

export default class Feed extends Component {
  state = {showNotification: false}

  static navigationOptions = ({ navigation }) => {
    const topicName = get('state.params.topicName', navigation)
    const communityName = get('state.params.communityName', navigation)
    return {
      headerTitle: topicName ? communityName : 'Home'
    }
  }

  componentDidMount () {
    const { community, navigation } = this.props
    if (community) navigation.setParams({communityName: this.props.community.name})
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
      topicSubscribed,
      postsTotal,
      followersTotal,
      goToCreateCommunityName,
      currentUserHasMemberships
    } = this.props
    if (!currentUserHasMemberships) return <CreateCommunityPrompt goToCreateCommunityName={goToCreateCommunityName} />

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

export function CreateCommunityPrompt ({goToCreateCommunityName}) {
  return <View style={styles.container}>
    <Text style={styles.promptText}>No posts here, try creating you're own Community!</Text>
    <Image style={styles.image} source={axolotlImage} />
    <Button
      text='Create a Community'
      style={styles.button}
      onPress={goToCreateCommunityName}
    />
  </View>
}
