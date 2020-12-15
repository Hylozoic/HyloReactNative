import React from 'react'
import { View } from 'react-native'
import { didPropsChange } from 'util/index'
import Loading from 'components/Loading'
import CreateCommunityNotice from 'components/CreateCommunityNotice'
import FeedList from 'navigation/FeedList'
import FeedBanner from 'components/FeedBanner'
import SocketSubscriber from 'components/SocketSubscriber'
import styles from './Feed.styles'

export default class Feed extends React.Component {
  componentDidMount () {
    const { community, navigation } = this.props
    if (community) navigation.setParams({ communityName: this.props.community.name })
    const { fetchCommunityTopic } = this.props
    if (fetchCommunityTopic) fetchCommunityTopic()
  }

  shouldComponentUpdate (nextProps) {
    return nextProps.isFocused && didPropsChange(this.props, nextProps)
  }

  onShowTopic = (...args) => this.props.showTopic(...args)
  onShowMember = (...args) => this.props.showMember(...args)
  onGoToCommunity = (...args) => this.props.goToCommunity(...args)
  onSetTopicSubscribe = (...args) => this.props.setTopicSubscribe(...args)
  onNewPost = (...args) => this.props.newPost(...args)

  render () {
    const {
      community,
      network,
      currentUser,
      route,
      navigation,
      showPost,
      topicName,
      topicSubscribed,
      postsTotal,
      followersTotal,
      goToCreateCommunityName,
      currentUserHasMemberships,
      hidePostPrompt,
      isProjectFeed
    } = this.props
    
    if (!currentUser) return <Loading style={{ flex: 1 }} />

    if (!currentUserHasMemberships) {
      return (
        <CreateCommunityNotice
          goToCreateCommunityName={goToCreateCommunityName}
          text='No posts here, try creating your own Community!'
        />
      )
    }

    const all = !community && !topicName

    const theme = this.props.belowBannerComponent
      ? { container: { marginBottom: 0 } }
      : {}

    return (
      <View style={styles.container}>
        <FeedList
          community={community}
          network={network}
          showPost={showPost}
          all={all}
          goToCommunity={this.onGoToCommunity}
          header={
            <View>
              <FeedBanner
                community={community}
                network={network}
                currentUser={currentUser}
                all={all}
                newPost={this.onNewPost}
                topicName={topicName}
                postsTotal={postsTotal}
                followersTotal={followersTotal}
                topicSubscribed={topicSubscribed}
                setTopicSubscribe={this.onSetTopicSubscribe}
                hidePostPrompt={hidePostPrompt}
                theme={theme}
              />
              {this.props.belowBannerComponent}
            </View>
}
          route={route}
          navigation={navigation}
          showMember={this.onShowMember}
          showTopic={this.onShowTopic}
          topicName={topicName}
          isProjectFeed={isProjectFeed}
        />
        {!topicName && community && <SocketSubscriber type='community' id={community.id} />}
      </View>
    )
  }
}
