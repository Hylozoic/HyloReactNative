import React from 'react'
import { View } from 'react-native'
import { get } from 'lodash/fp'

import CreateCommunityNotice from '../CreateCommunityNotice'
import FeedList from '../FeedList'
import FeedBanner from '../FeedBanner'
import SocketSubscriber from '../SocketSubscriber'
import styles from './Feed.styles'
import { didPropsChange } from 'util/index'

export default class Feed extends React.Component {
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
    return nextProps.isFocused && didPropsChange(this.props, nextProps)
  }

  handleShowTopic = (...args) => this.props.showTopic(...args)
  handleShowMember = (...args) => this.props.showMember(...args)
  handleGoToCommunity = (...args) => this.props.goToCommunity(...args)
  handleSetTopicSubscribe = (...args) => this.props.setTopicSubscribe(...args)
  handleNewPost = (...args) => this.props.newPost(...args)

  render () {
    const {
      community,
      network,
      currentUser,
      navigation,
      showPost,
      screenProps,
      topicName,
      topicSubscribed,
      postsTotal,
      followersTotal,
      goToCreateCommunityName,
      currentUserHasMemberships,
      hidePostPrompt,
      isProjectFeed
    } = this.props
    if (!currentUserHasMemberships) {
      return <CreateCommunityNotice
        goToCreateCommunityName={goToCreateCommunityName}
        text={'No posts here, try creating your own Community!'}
      />
    }

    const all = !community && !topicName

    const theme = this.props.belowBannerComponent
      ? {container: {marginBottom: 0}}
      : {}

    console.log('FEED - isProjectFeed', isProjectFeed)

    return <View style={styles.container}>
      <FeedList
        community={community}
        network={network}
        showPost={showPost}
        all={all}
        goToCommunity={this.handleGoToCommunity}
        header={
          <View>
            <FeedBanner
              community={community}
              network={network}
              currentUser={currentUser}
              all={all}
              newPost={this.handleNewPost}
              topicName={topicName}
              postsTotal={postsTotal}
              followersTotal={followersTotal}
              topicSubscribed={topicSubscribed}
              setTopicSubscribe={this.handleSetTopicSubscribe}
              hidePostPrompt={hidePostPrompt} 
              theme={theme} />
            {this.props.belowBannerComponent}
          </View>}
        navigation={navigation}
        screenProps={screenProps}
        showMember={this.handleShowMember}
        showTopic={this.handleShowTopic}
        topicName={topicName} 
        isProjectFeed={isProjectFeed} />
      {!topicName && community && <SocketSubscriber type='community' id={community.id} />}
    </View>
  }
}
