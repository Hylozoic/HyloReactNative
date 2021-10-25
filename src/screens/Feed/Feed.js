import React, { useRef, useEffect } from 'react'
import { Image, View, Text, TouchableOpacity } from 'react-native'
import { capitalize } from 'lodash/fp'
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
import useGroupSelect from 'hooks/useSelectGroup'
import getRouteParam from 'store/selectors/getRouteParam'

export function headerTitle (topicName, group, feedType) {
  let title 
  title = group?.name
  // topicName
  //   ? group?.name
  //   : 'Home'
  title = feedType ? capitalize(feedType + 's') : title
  return title
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
  fetchGroupTopic
}) {
  const feedType = getRouteParam('feedType', route)
  const ref = useRef(null)

  useGroupSelect()
  useEffect(() => { fetchGroupTopic() }, [])
  useEffect(() => {
    navigation.setOptions({
      title: headerTitle(topicName, group, feedType)
    })
  }, [topicName, group?.id, feedType])

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
  const showPostPrompt = !feedType && !topicName
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
      {feedType && (
        <Button
          style={styles.newPostButton}
          text={`Create ${capitalize(feedType)}`}
          onPress={() => newPost({ type: feedType })}
        />      
      )}
      {!feedType && <PostPrompt currentUser={currentUser} newPost={newPost} />}
      {!!currentUser && !feedType && <View style={styles.promptShadow} />}
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
      feedType={feedType}
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
