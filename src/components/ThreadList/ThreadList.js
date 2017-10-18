import React, { Component } from 'react'
import { FlatList, TouchableOpacity, View, Text } from 'react-native'
import { isEmpty } from 'lodash/fp'

import Loading from '../Loading'
import ThreadCard from '../ThreadCard'
import Header from './Header'
import styles from './ThreadList.styles'

export default class ThreadList extends Component {
  static navigationOptions = ({navigation}) => (Header(navigation))

  fetchOrShowCached () {
    const { hasMore, threads, fetchThreads } = this.props
    if (isEmpty(threads) && hasMore !== false) fetchThreads()
  }

  componentDidMount () {
    this.fetchOrShowCached()
  }
  _keyExtractor = (item, index) => item.id;

  render () {
    const { threads, pending, currentUser, fetchMoreThreads, showThread } = this.props

    if (pending && threads.length === 0) return <Loading />
    if (!pending && threads.length === 0) {
      return <Text style={styles.center}>No active conversations</Text>
    }

    return <View style={styles.threadList}>
      <FlatList
        data={threads}
        keyExtractor={this._keyExtractor}
        onEndReached={fetchMoreThreads}
        renderItem={({ item, index }) =>
          <MessageRow
            participants={item.participants}
            message={item.latestMessage}
            currentUser={currentUser}
            isLast={index === threads.length - 1}
            showThread={showThread}
         />}
        />
      {!pending && threads.length === 0 &&
        <Text style={styles.center}>No active conversations</Text>
      }
    </View>
  }
}

export function MessageRow ({message, participants, currentUser, showThread, isLast}) {
  return <View>
    <TouchableOpacity onPress={() => showThread(message.messageThread)}>
      <ThreadCard
        message={message}
        participants={participants}
        currentUser={currentUser}
        isLast={isLast}
      />
    </TouchableOpacity>
  </View>
}
