import React from 'react'
import { View } from 'react-native'
import { get } from 'lodash/fp'

import CreateCommunityNotice from '../CreateCommunityNotice'
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
    const { community, navigation } = this.props
    if (community) navigation.setParams({communityName: this.props.community.name})
    const { fetchCommunityTopic } = this.props
    if (fetchCommunityTopic) fetchCommunityTopic()
  }

  shouldComponentUpdate (nextProps) {
    return nextProps.isFocused
  }

  handleShowTopic = (topicName) => this.props.showTopic(topicName)
  handleShowMember = (memberId) => this.props.showMember(memberId)
  handleGoToCommunity = (communityId) => this.props.goToCommunity(communityId)

  render () {
    const {
      community,
      network,
      currentUser,
      navigation,
      newPost,
      showPost,
      screenProps,
      setTopicSubscribe,
      topicName,
      topicSubscribed,
      postsTotal,
      followersTotal,
      goToCreateCommunityName,
      currentUserHasMemberships
    } = this.props
    if (!currentUserHasMemberships) {
      return <CreateCommunityNotice
        goToCreateCommunityName={goToCreateCommunityName}
        text={'No posts here, try creating your own Community!'}
      />
    }
    return <View style={styles.container}>
      <FeedList
        community={community}
        network={network}
        showPost={showPost}
        goToCommunity={this.handleGoToCommunity}
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
        showMember={this.handleShowMember}
        showTopic={this.handleShowTopic}
        topicName={topicName} />
      {!topicName && community && <SocketSubscriber type='community' id={community.id} />}
    </View>
  }
}
