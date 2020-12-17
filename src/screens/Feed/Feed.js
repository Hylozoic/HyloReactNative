import React from 'react'
import { View } from 'react-native'
import { get } from 'lodash/fp'
import { didPropsChange } from 'util/index'
import Loading from 'components/Loading'
import CreateCommunityNotice from 'components/CreateCommunityNotice'
import FeedList from 'components/FeedList'
import FeedBanner from 'components/FeedBanner'
import SocketSubscriber from 'components/SocketSubscriber'
import styles from './Feed.styles'

export default class Feed extends React.Component {
  componentDidMount () {
    const { fetchCommunityTopic } = this.props
    if (fetchCommunityTopic) fetchCommunityTopic()
    this.setHeader()
  }

  componentDidUpdate (prevProps) {
    if (
      (get('id', prevProps.community) !== get('id', this.props.community)) ||
      (get('topicName', prevProps) !== get('topicName', this.props))
    ) {
      this.setHeader()
    }
  }

  shouldComponentUpdate (nextProps) {
    return nextProps.isFocused && didPropsChange(this.props, nextProps)
  }

  setHeader = () => {
    const { navigation, topicName, community } = this.props
    const headerTitle = topicName ? get('name', community) : ''
    navigation.setOptions({ headerTitle })
  }

  render () {
    const {
      community,
      network,
      currentUser,
      route,
      navigation,
      showPost,
      showMember,
      topicName,
      topicSubscribed,
      postsTotal,
      followersTotal,
      goToCreateCommunityName,
      currentUserHasMemberships,
      hidePostPrompt,
      isProjectFeed,
      goToCommunity,
      setTopicSubscribe,
      showTopic,
      newPost
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
          goToCommunity={goToCommunity}
          header={
            <View>
              <FeedBanner
                community={community}
                network={network}
                currentUser={currentUser}
                all={all}
                newPost={newPost}
                topicName={topicName}
                postsTotal={postsTotal}
                followersTotal={followersTotal}
                topicSubscribed={topicSubscribed}
                setTopicSubscribe={setTopicSubscribe}
                hidePostPrompt={hidePostPrompt}
                theme={theme}
              />
              {this.props.belowBannerComponent}
            </View>
          }
          route={route}
          navigation={navigation}
          showMember={showMember}
          showTopic={showTopic}
          topicName={topicName}
          isProjectFeed={isProjectFeed}
        />
        {!topicName && community && <SocketSubscriber type='community' id={community.id} />}
      </View>
    )
  }
}
