import React from 'react'
import { FlatList, Text, TouchableOpacity, View } from 'react-native'
import { isEmpty } from 'lodash/fp'
import { array, func } from 'prop-types'

import Icon from '../Icon'
import styles from './TopicList.styles'

export default class TopicList extends React.Component {
  static propTypes = {
    touchAction: func,
    topics: array
  }

  renderTopicRow = ({ item }) => <TopicRow item={item} onPress={this.props.touchAction} />

  render () {
    const { topics } = this.props

    return <View style={styles.topicList}>
      {isEmpty(topics)
        ? <Text style={styles.emptyList}>No topics match your search</Text>
        : <FlatList
          data={topics}
          keyboardShouldPersistTaps='handled'
          keyExtractor={i => i.id}
          renderItem={this.renderTopicRow} />}
    </View>
  }
}

export function TopicRow ({ item, onPress }) {
  return <TouchableOpacity style={styles.topicRow} onPress={() => onPress(item)}>
    <View style={styles.topicTitle}>
      <Text style={styles.hashtag}>#</Text><Text style={styles.topicName}>{item.name}</Text>
    </View>
    {item.followersTotal === undefined
      ? <View style={styles.topicDetails}><Text style={styles.detailText}>create new</Text></View>
      : <View style={styles.topicDetails}>
        <Icon name='Star' style={styles.detailIcon} />
        <Text style={styles.detailText}>{item.followersTotal} subscribers</Text>
        <Icon name='Post' style={styles.detailIcon} />
        <Text style={styles.detailText}>{item.postsTotal} posts</Text>
      </View>}
  </TouchableOpacity>
}
