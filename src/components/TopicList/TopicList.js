import React from 'react'
import { FlatList, Text, View } from 'react-native'
import { isEmpty } from 'lodash/fp'
import { array, func } from 'prop-types'
import TopicRow from './TopicRow'
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
          renderItem={this.renderTopicRow}
          keyboardShouldPersistTaps='handled'
          keyExtractor={i => i.id} />}
    </View>
  }
}
