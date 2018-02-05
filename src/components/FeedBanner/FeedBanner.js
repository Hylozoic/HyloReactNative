import React from 'react'
import { Image, View, Text, TouchableOpacity } from 'react-native'
import styles from './FeedBanner.styles'
import Avatar from '../Avatar'
import Icon from '../Icon'
import NotificationOverlay from '../NotificationOverlay'
import LinearGradient from 'react-native-linear-gradient'
import { isUndefined } from 'lodash'
import Button from '../Button'
const bannerImage = require('../../assets/all-communities-banner.png')

export default class FeedBanner extends React.Component {
  state = {}

  toggleSubscribe = () => {
    this.setState({
      overlayMessage: this.props.topicSubscribed
        ? 'UNSUBSCRIBED FROM TOPIC'
        : 'SUBSCRIBED TO TOPIC'
    })
    this.props.setTopicSubscribe()
  }

  resetOverlayMessage = () => {
    this.setState({overlayMessage: null})
  }

  render () {
    const {
      all, community, network, newPost, currentUser, topicSubscribed, topicName,
      postsTotal, followersTotal
    } = this.props

    let bannerUrl, name, image
    if (community && all) {
      name = 'All Communities'
      image = bannerImage
    } else if (network) {
      ({ bannerUrl, name } = network)
      if (bannerUrl) image = {uri: bannerUrl}
    } else if (community) {
      ({ bannerUrl, name } = community)
      if (bannerUrl) image = {uri: bannerUrl}
    } else {
      return null
    }

    if (topicName) {
      name = '#' + topicName
    }

    const pluralFollowers = (followersTotal !== 1)
    const pluralPosts = (postsTotal !== 1)

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
        <View style={styles.title}>
          <Text style={styles.name}
            numberOfLines={3}>
            {name}
          </Text>
          {topicName && <Text style={styles.subName}><Icon name='Star' /> {followersTotal} subscriber{pluralFollowers && 's'}   <Icon name='Post' style={styles.postTotalIcon} /> {postsTotal} post{pluralPosts && 's'}</Text>}
        </View>
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
  const text = active ? 'Unsubscribe' : 'Subscribe'
  return <Button onPress={onPress} style={styles.subscribeButton} iconName='Star' text={text} />
}
