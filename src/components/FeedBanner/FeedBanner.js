import React from 'react'
import { Image, View, Text, TouchableOpacity } from 'react-native'
import styles from './FeedBanner.styles'
import Icon from '../Icon'
import Avatar from '../Avatar'
import { DEFAULT_BANNER } from '../../store/models/Community'

export default function FeedBanner ({ all, community, newPost, currentUser }) {
  let bannerUrl, name

  if (all) {
    name = 'All Communities'
    bannerUrl = DEFAULT_BANNER
  } else if (!community) {
    return null
  } else {
    ({ bannerUrl, name } = community)
  }

  return <View style={styles.container}>
    <Image source={{uri: bannerUrl}} style={styles.image} />
    <View style={styles.titleRow}>
      <Text style={styles.name}>{name}</Text>
      <Icon name='More' style={styles.icon} />
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
      <Text style={styles.promptText}>Hi, {currentUser.firstName()}, what's on your mind?</Text>
    </TouchableOpacity>
  </View>
}
