import React from 'react'
import { Image, View, Text, TouchableOpacity } from 'react-native'
import styles from './FeedBanner.styles'
import Avatar from '../Avatar'
import Icon from '../Icon'

export default function FeedBanner ({
  all, community, newPost, currentUser, topicName, topicSubscribed
}) {
  let bannerUrl, name

  if (all) {
    name = 'All Communities'
  } else if (!community) {
    return null
  } else {
    ({ bannerUrl, name } = community)
  }

  return <View style={styles.container}>
    <Image source={{uri: bannerUrl}} style={styles.image} />
    <View style={styles.titleRow}>
      <Text style={[styles.name, all && styles.allName]}>{name}</Text>
      {!!topicName && <TouchableOpacity style={styles.subscribeButton}>
        <Icon name='Star' style={[
          styles.subscribeButtonIcon,
          topicSubscribed && styles.subscribeButtonIconActive
        ]} />
      </TouchableOpacity>}
    </View>
    <PostPrompt currentUser={currentUser} newPost={newPost} />
    {!!currentUser && <View style={styles.promptShadow} />}
  </View>
}

export function PostPrompt ({ currentUser, newPost }) {
  if (!currentUser) return null
  const { avatarUrl } = currentUser
  return <View style={styles.postPrompt}>
    <TouchableOpacity onPress={newPost} style={styles.promptButton}>
      <Avatar avatarUrl={avatarUrl} style={styles.avatar} />
      <Text style={styles.promptText}>{currentUser.firstName()}, what's on your mind?</Text>
    </TouchableOpacity>
  </View>
}
