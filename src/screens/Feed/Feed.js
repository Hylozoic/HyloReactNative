import React, { useRef, useEffect } from 'react'
import { Image, View, Text, TouchableOpacity } from 'react-native'
import { capitalize, isEmpty } from 'lodash/fp'
import { useDispatch, useSelector } from 'react-redux'
import LinearGradient from 'react-native-linear-gradient'
import { isUndefined } from 'lodash'
import { PUBLIC_GROUP_ID } from 'store/models/Group'
import makeGoToGroup from 'store/actions/makeGoToGroup'
import getRouteParam from 'store/selectors/getRouteParam'
import getCurrentGroup from 'store/selectors/getCurrentGroup'
import getMe from 'store/selectors/getMe'
import getMemberships from 'store/selectors/getMemberships'
import {
  fetchGroupTopic,
  getGroupTopic,
  setTopicSubscribe as setTopicSubscribeAction
} from './Feed.store'
import Loading from 'components/Loading'
import FeedList from 'components/FeedList'
import Button from 'components/Button'
import CreateGroupNotice from 'components/CreateGroupNotice'
import SocketSubscriber from 'components/SocketSubscriber'
import Avatar from 'components/Avatar'
import Icon from 'components/Icon'
import { bannerlinearGradientColors } from 'style/colors'
import styles from './Feed.styles'

export function headerTitle (group, feedType) {
  let title
  title = group?.name
  title = feedType ? capitalize(feedType + 's') : title
  return title
}

export default function Feed ({ topicName: providedTopicName, route, navigation }) {
  const ref = useRef(null)
  const dispatch = useDispatch()
  const feedType = getRouteParam('feedType', route)
  const topicName = providedTopicName || getRouteParam('topicName', route)

  const currentUser = useSelector(getMe)
  const memberships = useSelector(getMemberships)
  const currentUserHasMemberships = !isEmpty(memberships)
  const group = useSelector(getCurrentGroup)
  console.log('!!! group', group?.slug)
  const groupTopic = useSelector(state => getGroupTopic(state, { topicName, slug: group?.slug }))
  const topic = groupTopic?.topic?.ref
  const topicSubscribed = groupTopic?.isSubscribed
  const topicPostsTotal = groupTopic?.postsTotal
  const topicFollowersTotal = groupTopic?.followersTotal
  const goToGroup = groupSlug => makeGoToGroup(navigation, dispatch)(groupSlug, memberships, group.slug)
  const goToPostEditor = (params = {}) => navigation.navigate('Edit Post', { groupId: group.id, ...params })
  const goToPostDetails = id => navigation.navigate('Post Details', { id })
  const goToCreateGroup = () => navigation.navigate('Create Group')
  const goToMember = id => navigation.navigate('Member', { id })
  const goToTopic = selectedTopicName => {
    if (selectedTopicName === topic?.name) return
    if (topic?.name) {
      navigation.setParams({ topicName: selectedTopicName })
    } else {
      navigation.push('Topic Feed', { groupId: group.id, topicName: selectedTopicName })
    }
  }

  useEffect(() => {
    topicName && group?.slug && dispatch(fetchGroupTopic(topicName, group.slug))
  }, [topicName, group?.slug])

  useEffect(() => {
    navigation.setOptions({
      title: headerTitle(group, feedType)
    })
  }, [topicName, group?.id, feedType])

  if (!currentUser) return <Loading style={{ flex: 1 }} />

  if (!currentUserHasMemberships && group?.id !== PUBLIC_GROUP_ID) {
    return (
      <CreateGroupNotice
        goToCreateGroup={goToCreateGroup}
        text='No posts here, try creating your own Group!'
      />
    )
  }

  if (!group) return null

  const setTopicSubscribe = () => topicName && group.id && dispatch(setTopicSubscribeAction(topic.id, group.id, !topicSubscribed))
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
    <View
      style={[
        styles.bannerContainer,
        showPostPrompt ? styles.bannerContainerWithPostPrompt : {}
      ]}
    >
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
                <Icon name='Star' /> {topicFollowersTotal || 0} subscriber{pluralFollowers && 's'}
              </Text>
              <Text style={styles.subName}>
                <Icon name='Post' /> {topicPostsTotal || 0} post{pluralPosts && 's'}
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
          onPress={() => goToPostEditor({ type: feedType })}
        />
      )}
      {!feedType && <PostPrompt currentUser={currentUser} newPost={goToPostEditor} />}
      {!!currentUser && !feedType && <View style={styles.promptShadow} />}
    </View>
  )

  return (
    <>
      <FeedList
        scrollRef={ref}
        group={group}
        showPost={goToPostDetails}
        goToGroup={goToGroup}
        header={feedListHeader}
        route={route}
        navigation={navigation}
        showMember={goToMember}
        showTopic={goToTopic}
        topicName={topicName}
        feedType={feedType}
      />
      {!topicName && group && (
        <SocketSubscriber type='group' id={group.id} />
      )}
    </>
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
