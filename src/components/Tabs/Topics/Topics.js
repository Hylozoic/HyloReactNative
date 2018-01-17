import React from 'react'
import { Text, ScrollView, Image, View, TouchableOpacity } from 'react-native'
import KeyboardFriendlyView from '../../KeyboardFriendlyView'
import StarIcon from '../../StarIcon'
import Header from '../Header'
import styles from './Topics.styles'

const title = 'Topics'

export default class Topics extends React.Component {
  static navigationOptions = ({navigation}) => (Header(navigation, title))

  render () {
    const { community, topics } = this.props
    const { bannerUrl, name } = community
    const image = {uri: bannerUrl}

    return <KeyboardFriendlyView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image source={image} style={styles.image} />
        <View style={styles.imageOverlay} />
        <Text style={styles.title}>{name}</Text>
        <View style={styles.searchPlaceholder} />
        <TopicList topics={topics} />
      </ScrollView>
    </KeyboardFriendlyView>
  }
}

export class TopicList extends React.Component {
  render () {
    const { topics } = this.props
    return <View style={styles.topicList}>
      {topics.map((topic, i) => <TopicRow topic={topic} key={i} first={i === 0} />)}
    </View>
  }
}

export function TopicRow ({ topic, first }) {
  const { name, unreadCount, subscribed } = topic
  return <View style={[styles.topicRow, first && styles.firstRow]}>
    <SubscribeStar subscribed={subscribed} onPress={subscribe => console.log('subscribe', subscribe)} />
    <Text style={styles.topicName}>#{name}</Text>
  </View>
}

export function SubscribeStar ({ subscribed, onPress }) {
  const theme = subscribed
    ? styles.subscribedStar
    : styles.unSubscribedStar
  return <TouchableOpacity style={styles.star} onPress={() => onPress(!subscribed)}>
    <StarIcon theme={theme} />
  </TouchableOpacity>
}
