import React, { useRef, useEffect } from 'react'
import { View } from 'react-native'
import { useScrollToTop } from '@react-navigation/native'
import Loading from 'components/Loading'
import CreateCommunityNotice from 'components/CreateCommunityNotice'
import FeedList from 'components/FeedList'
import FeedBanner from 'components/FeedBanner'
import SocketSubscriber from 'components/SocketSubscriber'
import styles from './Feed.styles'
import Button from 'components/Button'

export function setHeaderTitle (navigation, topicName, community, isProjectFeed) {
  let headerTitle 
  headerTitle = topicName
    ? community?.name
    : 'Home'
  headerTitle = isProjectFeed
    ? 'Projects'
    : headerTitle
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
  newProject,
  fetchCommunityTopic
}) {
  const ref = useRef(null)

  useEffect(() => { fetchCommunityTopic() }, [ fetchCommunityTopic, topicName ])
  useEffect(() => { setHeaderTitle(navigation, topicName, community, isProjectFeed) }, [topicName, community?.id, isProjectFeed])

  if (!currentUser) return <Loading style={{ flex: 1 }} />

  if (!currentUserHasMemberships) {
    return (
      <CreateCommunityNotice
        goToCreateCommunity={goToCreateCommunity}
        text='No posts here, try creating your own Community!'
      />
    )
  }

  useScrollToTop(ref)

  const all = !community && !topicName

  return (
    <View style={styles.container}>
      <FeedList
        scrollRef={ref}
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
              hidePostPrompt={all || isProjectFeed || hidePostPrompt}
              rightSideButton={!network?.id && isProjectFeed && (
                <CreateProjectButton createProject={() => newProject(community?.id)} />
              )}
            />
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

export function CreateProjectButton ({ createProject }) {
  return (
    <Button
      style={styles.button}
      text='Create Project'
      onPress={createProject}
    />
  )
}
