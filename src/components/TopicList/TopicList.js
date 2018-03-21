import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { isEmpty } from 'lodash/fp'
import EntypoIcon from 'react-native-vector-icons/Entypo'

import Badge from '../../Badge'
import StarIcon from '../../StarIcon'
import styles from './TopicList.styles'

export class TopicList extends React.Component {
  render () {
    const { topics, setTopicSubscribe, goToTopic } = this.props
    return <View style={styles.topicList}>
      {isEmpty(topics)
        ? <Text style={styles.emptyList}>No topics match your search</Text>
        : topics.map((topic, i) =>
          <TopicRow topic={topic} key={i} first={i === 0}
            setTopicSubscribe={setTopicSubscribe}
            goToTopic={goToTopic} />)}
    </View>
  }
}

export function TopicRow ({ topic, first, setTopicSubscribe, goToTopic }) {
  const { name, newPostCount, isSubscribed } = topic
  return <TouchableOpacity style={[styles.topicRow, first && styles.firstRow]}
    onPress={() => goToTopic(topic.name)}>
    <SubscribeStar isSubscribed={isSubscribed} onPress={() => setTopicSubscribe(topic.id, !isSubscribed)} />
    <Text style={styles.topicName}>#{name}</Text>
    <View style={styles.rightItems}>
      <Badge style={styles.badge} count={newPostCount} />
      <EntypoIcon style={styles.chevron} name={'chevron-right'} />
    </View>
  </TouchableOpacity>
}

export function SubscribeStar ({ isSubscribed, onPress }) {
  const theme = isSubscribed
    ? styles.subscribedStar
    : styles.unSubscribedStar
  return <TouchableOpacity style={styles.star}
    onPress={() => onPress(!isSubscribed)}
    hitSlop={{top: 10, bottom: 10, left: 15, right: 15}}>
    <StarIcon theme={theme} />
  </TouchableOpacity>
}
