import React, { useRef, useEffect } from 'react'
import { Image, View, Text, TouchableOpacity } from 'react-native'
import { useScrollToTop } from '@react-navigation/native'
import Avatar from 'components/Avatar'
import Icon from 'components/Icon'
// import NotificationOverlay from 'components/NotificationOverlay'
import LinearGradient from 'react-native-linear-gradient'
import { isUndefined } from 'lodash'
import Button from 'components/Button'
import { bannerlinearGradientColors } from 'style/colors'
import Loading from 'components/Loading'
import CreateGroupNotice from 'components/CreateGroupNotice'
import FeedList from 'components/FeedList'
import SocketSubscriber from 'components/SocketSubscriber'
import styles from './Feed.styles'

export function setHeaderTitle (navigation, topicName, group, isProjectFeed) {
  let headerTitle 
  headerTitle = topicName
    ? group?.name
    : 'Home'
  headerTitle = isProjectFeed
    ? 'Projects'
    : headerTitle
  navigation.setOptions({ headerTitle })
}

export default function Feed ({
  group,
  currentUser,
  route,
  navigation,
  showPost,
  showMember,
  topicName,
  topicSubscribed,
  topicPostsTotal,
  topicFollowersTotal,
  goToCreateGroup,
  currentUserHasMemberships,
  goToGroup,
  setTopicSubscribe,
  showTopic,
  newPost,
  newProject,
  fetchGroupTopic,
  selectGroup
}) {
  const isProjectFeed = route?.params?.isProjectFeed
  const ref = useRef(null)

  useScrollToTop(ref)
  // TODO: selectGroup should probably be moved back into goToGroup function
  useEffect(() => { group?.id && selectGroup(group.id) }, [group?.id])
  useEffect(() => { fetchGroupTopic() }, [fetchGroupTopic, topicName])
  useEffect(() => { setHeaderTitle(navigation, topicName, group, isProjectFeed) }, [
    topicName,
    group?.id, 
    isProjectFeed
  ])

  if (!currentUser) return <Loading style={{ flex: 1 }} />

  if (!currentUserHasMemberships) {
    return (
      <CreateGroupNotice
        goToCreateGroup={goToCreateGroup}
        text='No posts here, try creating your own Group!'
      />
    )
  }

  if (!group) return null

  const name = topicName
    ? '#' + topicName
    : group.name
  const image = group.bannerUrl
    ? { uri: group.bannerUrl }
    : null
  const pluralFollowers = (topicFollowersTotal !== 1)
  const pluralPosts = (topicPostsTotal !== 1)
  const showPostPrompt = !isProjectFeed && !topicName
  const feedListHeader = (
    <View style={[styles.bannerContainer, showPostPrompt ? styles.bannerContainerWithPostPrompt : {}]}>
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
      </View>
      {!isUndefined(topicSubscribed) && (
        <SubscribeButton active={topicSubscribed} onPress={setTopicSubscribe} />
      )}
      {isProjectFeed && (
        <CreateProjectButton createProject={() => newProject(group?.id)} />
      )}
      {showPostPrompt && <PostPrompt currentUser={currentUser} newPost={newPost} />}
      {!!currentUser && showPostPrompt && <View style={styles.promptShadow} />}
    </View>
  )

  return <>
    <FeedList
      scrollRef={ref}
      group={group}
      showPost={showPost}
      goToGroup={goToGroup}
      header={feedListHeader}
      route={route}
      navigation={navigation}
      showMember={showMember}
      showTopic={showTopic}
      topicName={topicName}
      isProjectFeed={isProjectFeed}
    />
    {!topicName && group && (
      <SocketSubscriber type='group' id={group.id} />
    )}
  </>
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
