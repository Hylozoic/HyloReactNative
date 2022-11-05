import React, { useRef, useEffect } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import FastImage from 'react-native-fast-image'
import { useNavigation, useRoute } from '@react-navigation/native'
import { capitalize, isEmpty } from 'lodash/fp'
import { useDispatch, useSelector } from 'react-redux'
import LinearGradient from 'react-native-linear-gradient'
import { isUndefined } from 'lodash'
import useChangeToGroup from 'hooks/useChangeToGroup'
import { PUBLIC_GROUP_ID } from 'store/models/Group'
import getCurrentGroup from 'store/selectors/getCurrentGroup'
import getGroupTopic from 'store/selectors/getGroupTopic'
import getMe from 'store/selectors/getMe'
import getMemberships from 'store/selectors/getMemberships'
import getRouteParam from 'store/selectors/getRouteParam'
import toggleGroupTopicSubscribeAction from 'store/actions/toggleGroupTopicSubscribe'
import fetchGroupTopic from 'store/actions/fetchGroupTopic'
import Avatar from 'components/Avatar'
import Button from 'components/Button'
import CreateGroupNotice from 'components/CreateGroupNotice'
import Icon from 'components/Icon'
import FeedList from 'components/FeedList'
import Loading from 'components/Loading'
import SocketSubscriber from 'components/SocketSubscriber'
import { bannerlinearGradientColors } from 'style/colors'
import styles from './Feed.styles'

export function headerTitle (currentGroup, feedType) {
  let title
  title = currentGroup?.name
  title = feedType ? capitalize(feedType + 's') : title
  return title
}

export default function Feed ({ topicName: providedTopicName }) {
  const ref = useRef(null)
  const navigation = useNavigation()
  const route = useRoute()
  const dispatch = useDispatch()
  const changeToGroup = useChangeToGroup()
  const feedType = getRouteParam('feedType', route)
  const topicName = providedTopicName || getRouteParam('topicName', route)

  const currentUser = useSelector(getMe)
  const memberships = useSelector(getMemberships)
  const currentUserHasMemberships = !isEmpty(memberships)
  const currentGroup = useSelector(getCurrentGroup)
  const groupTopic = useSelector(state => getGroupTopic(state, { topicName, slug: currentGroup?.slug }))
  const topic = groupTopic?.topic?.ref
  const topicSubscribed = groupTopic?.isSubscribed
  const topicPostsTotal = groupTopic?.postsTotal
  const topicFollowersTotal = groupTopic?.followersTotal
  const goToPostDetails = id => navigation.navigate('Post Details', { id })
  const goToCreateGroup = () => navigation.navigate('Create Group')
  const goToMember = id => navigation.navigate('Member', { id })
  const goToTopic = selectedTopicName => {
    if (selectedTopicName === topic?.name) return
    if (topic?.name) {
      navigation.setParams({ topicName: selectedTopicName })
    } else {
      navigation.push('Feed', { groupId: currentGroup.id, topicName: selectedTopicName })
    }
  }

  useEffect(() => {
    topicName && currentGroup?.slug && dispatch(fetchGroupTopic(topicName, currentGroup.slug))
  }, [dispatch, topicName, currentGroup?.slug])

  useEffect(() => {
    navigation.setOptions({
      title: headerTitle(currentGroup, feedType)
    })
  }, [navigation, topicName, currentGroup, currentGroup?.id, feedType])

  if (!currentUser) return <Loading style={{ flex: 1 }} />

  if (!currentUserHasMemberships && currentGroup?.id !== PUBLIC_GROUP_ID) {
    return (
      <CreateGroupNotice
        goToCreateGroup={goToCreateGroup}
        text='No posts here, try creating your own Group!'
      />
    )
  }

  if (!currentGroup) return null

  const toggleTopicSubscribe = () => groupTopic && currentGroup.id && dispatch(toggleGroupTopicSubscribeAction(groupTopic))
  const name = topicName
    ? '#' + topicName
    : currentGroup.name
  const image = currentGroup.bannerUrl
    ? { uri: currentGroup.bannerUrl }
    : null
  const pluralFollowers = (topicFollowersTotal !== 1)
  const pluralPosts = (topicPostsTotal !== 1)
  const feedListHeader = (
    <View
      style={[
        styles.bannerContainer,
        styles.bannerContainerWithPostPrompt
      ]}
    >
      <FastImage source={image} style={styles.image} />
      <LinearGradient style={styles.gradient} colors={bannerlinearGradientColors} />
      <View style={styles.titleRow}>
        <View style={styles.title}>
          <Text style={styles.name} numberOfLines={3}>
            {name}
          </Text>
          {topicName && (
            <View style={styles.topicInfo}>
              <Text style={styles.topicInfoText}>
                <Icon name='Star' /> {topicFollowersTotal || 0} subscriber{pluralFollowers && 's'}
              </Text>
              <Text style={styles.topicInfoText}>
                <Icon name='Post' /> {topicPostsTotal || 0} post{pluralPosts && 's'}
              </Text>
              {!isUndefined(topicSubscribed) && (
                <SubscribeButton active={topicSubscribed} onPress={toggleTopicSubscribe} />
              )}
            </View>
          )}
        </View>
      </View>
      <PostPrompt
        currentUser={currentUser}
        forGroup={currentGroup}
        currentTopicName={topicName}
        currentType={feedType}
      />
    </View>
  )

  return (
    <>
      <FeedList
        scrollRef={ref}
        forGroup={currentGroup}
        showPost={goToPostDetails}
        goToGroup={changeToGroup}
        header={feedListHeader}
        route={route}
        navigation={navigation}
        showMember={goToMember}
        showTopic={goToTopic}
        topicName={topicName}
        feedType={feedType}
      />
      {!topicName && currentGroup && (
        <SocketSubscriber type='group' id={currentGroup.id} />
      )}
    </>
  )
}

export function postPromptString (type = '', { firstName }) {
  const postPrompts = {
    offer: `Hi ${firstName}, what would you like to share?`,
    request: `Hi ${firstName}, what are you looking for?`,
    project: `Hi ${firstName}, what would you like to create?`,
    event: `Hi ${firstName}, want to create an event?`,
    default: `Hi ${firstName}, what's on your mind?`
  }

  return postPrompts[type] || postPrompts.default
}

export function PostPrompt ({ currentUser, forGroup, currentType, currentTopicName }) {
  const navigation = useNavigation()

  if (!currentUser) return null

  const handleOpenPostEditor = () => (
    navigation.navigate('Edit Post', {
      type: currentType,
      groupId: forGroup.id,
      topicName: currentTopicName
    })
  )

  const { avatarUrl } = currentUser

  return (
    <View style={styles.postPrompt}>
      <TouchableOpacity onPress={handleOpenPostEditor} style={styles.promptButton}>
        <Avatar avatarUrl={avatarUrl} style={styles.avatar} />
        <Text style={styles.promptText}>{postPromptString(currentType, { firstName: currentUser.firstName() })}</Text>
      </TouchableOpacity>
    </View>
  )
}

export function SubscribeButton ({ active, onPress }) {
  const text = active ? 'Unsubscribe' : 'Subscribe'
  const style = active ? styles.unsubscribeButton : styles.subscribeButton
  return <Button onPress={onPress} style={style} iconName='Star' text={text} />
}
