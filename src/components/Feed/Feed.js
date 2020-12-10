import React from 'react'
import { View } from 'react-native'
import CreateCommunityNotice from '../CreateCommunityNotice'
import FeedList from '../FeedList'
import FeedBanner from '../FeedBanner'
import SocketSubscriber from '../SocketSubscriber'
import styles from './Feed.styles'
import { didPropsChange } from 'util/index'

export default class Feed extends React.Component {
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
      route,
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
        route={route}
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
