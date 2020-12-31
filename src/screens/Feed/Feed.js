import React, { useRef, useEffect } from 'react'
import { Image, View, Text, TouchableOpacity } from 'react-native'
import { useScrollToTop } from '@react-navigation/native'
import Avatar from 'components/Avatar'
import Icon from 'components/Icon'
import NotificationOverlay from 'components/NotificationOverlay'
import LinearGradient from 'react-native-linear-gradient'
import { isUndefined } from 'lodash'
import Button from 'components/Button'
import { bannerlinearGradientColors } from 'style/colors'
import Loading from 'components/Loading'
import CreateCommunityNotice from 'components/CreateCommunityNotice'
import FeedList from 'components/FeedList'
import SocketSubscriber from 'components/SocketSubscriber'
import styles from './Feed.styles'

const allCommunitiesBannerImage = require('assets/all-communities-banner.png')

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

  const all = !community && !topicName && !network

  // From FeedBanner
  let bannerUrl, name, image
  if (all) {
    name = 'All Communities'
    image = allCommunitiesBannerImage
  } else if (network) {
    ({ bannerUrl, name } = network)
    if (bannerUrl) image = { uri: bannerUrl }
  } else if (community) {
    ({ bannerUrl, name } = community)
    if (bannerUrl) image = { uri: bannerUrl }
  } else {
    return null
  }

  if (topicName) {
    name = '#' + topicName
  }

  const pluralFollowers = (topicFollowersTotal !== 1)
  const pluralPosts = (topicPostsTotal !== 1)
  const showPostPrompt = !hidePostPrompt
  const feedListHeader = (
    <View style={[styles.container, showPostPrompt ? styles.containerWithPostPrompt : {}]}>
      <Image source={image} style={styles.image} />
      <LinearGradient style={styles.gradient} colors={bannerlinearGradientColors} />
      <View style={styles.titleRow}>
        <View style={styles.title}>
          <Text style={styles.name} numberOfLines={3}>
            {name}
          </Text>
          {topicName && (
            <View style={styles.topicInfo}>
              <Text style={styles.subName}>
                <Icon name='Star' /> {topicFollowersTotal} subscriber{pluralFollowers && 's'}
              </Text>
              <Text style={styles.subName}>
                <Icon name='Post' /> {topicPostsTotal} post{pluralPosts && 's'}
              </Text>
            </View>
          )}
        </View>
        {!isUndefined(topicSubscribed) && (
          <SubscribeButton active={topicSubscribed} onPress={setTopicSubscribe} />
        )}
        {!network?.id && isProjectFeed && (
          <CreateProjectButton createProject={() => newProject(community?.id)} />
        )}
      </View>
      {showPostPrompt && <PostPrompt currentUser={currentUser} newPost={newPost} />}
      {!!currentUser && showPostPrompt && <View style={styles.promptShadow} />}
    </View>
  )

  return (
    <View style={styles.feedListContainer}>
      <FeedList
        scrollRef={ref}
        community={community}
        network={network}
        showPost={showPost}
        goToCommunity={goToCommunity}
        header={feedListHeader}
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

export function PostPrompt ({ currentUser, newPost }) {
  if (!currentUser) return null
  const { avatarUrl } = currentUser
  return (
    <View style={styles.postPrompt}>
      <TouchableOpacity onPress={newPost} style={styles.promptButton}>
        <Avatar avatarUrl={avatarUrl} style={styles.avatar} />
        <Text style={styles.promptText}>{currentUser.firstName()}, what's on your mind?</Text>
      </TouchableOpacity>
    </View>
  )
}

export function SubscribeButton ({ active, onPress }) {
  const text = active ? 'Unsubscribe' : 'Subscribe'
  const style = active ? styles.unsubscribeButton : styles.subscribeButton
  return <Button onPress={onPress} style={style} iconName='Star' text={text} />
}

export function CreateProjectButton ({ createProject }) {
  return (
    <Button
      style={styles.createProjectButton}
      text='Create Project'
      onPress={createProject}
    />
  )
}

// const toggleSubscribe = () => {
//   this.setState({
//     overlayMessage: this.props.topicSubscribed
//       ? 'UNSUBSCRIBED FROM TOPIC'
//       : 'SUBSCRIBED TO TOPIC'
//   })
//   setTopicSubscribe()
// }
//
// resetOverlayMessage = () => {
//   this.setState({ overlayMessage: null })
// }
//
// {!!this.state.overlayMessage && (
//   <NotificationOverlay
//     message={this.state.overlayMessage}
//     type='info'
//     onComplete={this.resetOverlayMessage}
//   />
// )}
