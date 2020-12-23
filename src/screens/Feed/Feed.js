import React, { useEffect } from 'react'
import { View } from 'react-native'
import { get } from 'lodash/fp'
import { didPropsChange } from 'util/index'
import Loading from 'components/Loading'
import CreateCommunityNotice from 'components/CreateCommunityNotice'
import FeedList from 'components/FeedList'
import FeedBanner from 'components/FeedBanner'
import SocketSubscriber from 'components/SocketSubscriber'
import styles from './Feed.styles'
import fetchCommunityTopics from 'store/actions/fetchCommunityTopics'

export function setHeader (navigation, topicName, community){
  const headerTitle = topicName ? community?.name : 'Home'
  navigation.setOptions({ headerTitle })
}

export default function Feed ({
  community,
  network,
  currentUser,
  route,
  navigation,
  showPost,
  showMember,
  topicName,
  topicSubscribed,
  topicPostsTotal,
  topicFollowersTotal,
  goToCreateCommunity,
  currentUserHasMemberships,
  hidePostPrompt,
  isProjectFeed,
  goToCommunity,
  setTopicSubscribe,
  showTopic,
  newPost,
  fetchCommunityTopic,
  belowBannerComponent
}) {
  useEffect(() => { fetchCommunityTopic() }, [ fetchCommunityTopic, topicName ])
  useEffect(() => { setHeader(navigation, topicName, community) }, [ topicName, community?.id ])

  if (!currentUser) return <Loading style={{ flex: 1 }} />
  if (!currentUserHasMemberships) {
    return (
      <CreateCommunityNotice
        goToCreateCommunity={goToCreateCommunity}
        text='No posts here, try creating your own Community!'
      />
    )
  }

  const all = !community && !topicName
  const theme = belowBannerComponent
    ? { container: { marginBottom: 0 } }
    : {}

  return (
    <View style={styles.container}>
      <FeedList
        community={community}
        network={network}
        showPost={showPost}
        goToCommunity={goToCommunity}
        header={
          <View>
            <FeedBanner
              currentUser={currentUser}
              community={community}
              network={network}
              newPost={newPost}
              topicName={topicName}
              topicPostsTotal={topicPostsTotal}
              topicFollowersTotal={topicFollowersTotal}
              topicSubscribed={topicSubscribed}
              setTopicSubscribe={setTopicSubscribe}
              hidePostPrompt={all || hidePostPrompt}
              theme={theme}
            />
            {belowBannerComponent}
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
