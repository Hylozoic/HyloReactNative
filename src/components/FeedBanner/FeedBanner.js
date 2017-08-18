import React from 'react'
import { Image, View, Text, TouchableOpacity } from 'react-native'
import styles from './FeedBanner.styles'
import Avatar from '../Avatar'
const hyloMerkaba = require('../../assets/hylo-merkaba.png')

export default function FeedBanner ({ all, community, newPost, currentUser }) {
  let bannerUrl, name

  if (all) {
    name = 'All Communities'
  } else if (!community) {
    return null
  } else {
    ({ bannerUrl, name } = community)
  }

  return <View style={styles.container}>
    <Image source={{uri: bannerUrl}} style={[styles.image, all && styles.allBanner]} />
    <View style={styles.titleRow}>
      {all && <Image source={hyloMerkaba} style={styles.allLogo} />}
      <Text style={[styles.name, all && styles.allName]}>{name}</Text>
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
