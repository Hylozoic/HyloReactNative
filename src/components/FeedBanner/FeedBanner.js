import React from 'react'
import { Image, View, Text, TouchableOpacity } from 'react-native'
import styles from './FeedBanner.styles'
import Avatar from '../Avatar'
import Icon from '../Icon'
import NotificationOverlay from '../NotificationOverlay'
import LinearGradient from 'react-native-linear-gradient'
import { isUndefined } from 'lodash'
const bannerImage = require('../../assets/all-communities-banner.png')

export default class FeedBanner extends React.Component {
  state = {}

  toggleSubscribe = () => {
    this.setState({
      overlayMessage: this.props.topicSubscribed
        ? 'UNSUBSCRIBED FROM TOPIC'
        : 'SUBSCRIBED TO TOPIC'
    })
    this.props.toggleTopicSubscribe()
  }

  resetOverlayMessage = () => {
    this.setState({overlayMessage: null})
  }

  render () {
    const {
      all, community, newPost, currentUser, topicSubscribed
    } = this.props

    let bannerUrl, name, image
    if (all) {
      name = 'All Communities'
      image = bannerImage
    } else if (!community) {
      return null
    } else {
      ({ bannerUrl, name } = community)
      if (bannerUrl) image = {uri: bannerUrl}
    }

    return <View style={styles.container}>
      <Image source={image} style={styles.image} />
      <LinearGradient style={styles.gradient}
        colors={[
          'rgba(0, 0, 0, 0)',
          'rgba(0, 0, 0, 0.1)',
          'rgba(0, 0, 0, 0.3)',
          'rgba(0, 0, 0, 0.6)'
        ]} />
      <View style={styles.titleRow}>
        <Text style={styles.name}
          numberOfLines={3}>
          {name}
        </Text>
        {!isUndefined(topicSubscribed) && <SubscribeButton
          active={topicSubscribed} onPress={this.toggleSubscribe} />}
      </View>
      {!all && <PostPrompt currentUser={currentUser} newPost={newPost} />}
      {!!currentUser && !all && <View style={styles.promptShadow} />}
      {!!this.state.overlayMessage &&
        <NotificationOverlay message={this.state.overlayMessage}
          type='info'
          onComplete={this.resetOverlayMessage} />}
    </View>
  }
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

function SubscribeButton ({ active, onPress }) {
  return <TouchableOpacity style={styles.subscribeButton}
    onPress={onPress}
    hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
    <Icon name='Star' style={[
      styles.subscribeButtonIcon,
      active && styles.subscribeButtonIconActive
    ]} />
  </TouchableOpacity>
}
