import React from 'react'
import { Image, View, Text, TouchableOpacity } from 'react-native'
import styles from './FeedBanner.styles'
import Avatar from 'components/Avatar'
import Icon from 'components/Icon'
import NotificationOverlay from 'components/NotificationOverlay'
import LinearGradient from 'react-native-linear-gradient'
import { isUndefined } from 'lodash'
import Button from 'components/Button'
import { bannerlinearGradientColors } from 'style/colors'
const bannerImage = require('../../assets/all-communities-banner.png')

export default class FeedBanner extends React.PureComponent {
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
    this.setState({ overlayMessage: null })
  }

  render () {
    const {
      all, community, network, newPost, currentUser, topicSubscribed, topicName,
      postsTotal, followersTotal, hidePostPrompt, theme
    } = this.props

    let bannerUrl, name, image
    if (community && all) {
      name = 'All Communities'
      image = bannerImage
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

    const pluralFollowers = (followersTotal !== 1)
    const pluralPosts = (postsTotal !== 1)
    const showPostPrompt = !all && !hidePostPrompt

    return (
      <View style={{ ...styles.container, ...theme.container }}>
        <Image source={image} style={styles.image} />
        <LinearGradient style={styles.gradient} colors={bannerlinearGradientColors} />
        <View style={styles.titleRow}>
          <View style={styles.title}>
            <Text
              style={styles.name}
              numberOfLines={3}
            >
              {name}
            </Text>
            {topicName &&
              <View style={styles.topicInfo}>
                <Text style={styles.subName}>
                  <Icon name='Star' /> {followersTotal} subscriber{pluralFollowers && 's'}
                </Text>
                <Text style={styles.subName}>
                  <Icon name='Post' /> {postsTotal} post{pluralPosts && 's'}
                </Text>
              </View>}
          </View>
          {!isUndefined(topicSubscribed) && <SubscribeButton
            active={topicSubscribed} onPress={this.toggleSubscribe}
                                            />}
        </View>
        {showPostPrompt && <PostPrompt currentUser={currentUser} newPost={newPost} />}
        {!!currentUser && showPostPrompt && <View style={styles.promptShadow} />}
        {!!this.state.overlayMessage &&
          <NotificationOverlay
            message={this.state.overlayMessage}
            type='info'
            onComplete={this.resetOverlayMessage}
          />}
      </View>
    )
  }
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

function SubscribeButton ({ active, onPress }) {
  const text = active ? 'Unsubscribe' : 'Subscribe'
  const style = active ? styles.unsubscribeButton : styles.subscribeButton
  return <Button onPress={onPress} style={style} iconName='Star' text={text} />
}
