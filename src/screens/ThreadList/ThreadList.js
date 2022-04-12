import React, { Component } from 'react'
import { FlatList, TouchableOpacity, View, Text } from 'react-native'
import { useIsFocused } from '@react-navigation/native'
import { isEmpty } from 'lodash/fp'
import { getSocket } from 'util/websockets'
import ThreadCard from 'components/ThreadCard'
import styles from './ThreadList.styles'
import Loading from 'components/Loading'

export default function (props) {
  const isFocused = useIsFocused()
  return <ThreadList {...props} isFocused={isFocused} />
}

export class ThreadList extends Component {
  componentDidMount () {
    this.props.updateLastViewed()
    this.fetchOrShowCached()
    getSocket().then(socket => socket.on('reconnect', this.props.refreshThreads))
  }

  shouldComponentUpdate (nextProps) {
    return nextProps.isFocused
  }

  fetchOrShowCached () {
    const { hasMore, threads, fetchThreads } = this.props
    if (isEmpty(threads) && hasMore !== false) return fetchThreads()
  }

  _keyExtractor = (item, index) => item.id.toString()

  render () {
    const {
      threads,
      pending,
      currentUser,
      fetchMoreThreads,
      showThread,
      refreshThreads,
      pendingRefresh
      // isConnected
    } = this.props

    return (
      <View style={styles.threadList}>
        {pending && (
          <Loading />
        )}
        {!pending && threads.length === 0 && (
          <Text style={styles.center}>No active conversations</Text>
        )}
        <FlatList
          data={threads}
          keyExtractor={this._keyExtractor}
          onEndReached={fetchMoreThreads}
          onRefresh={refreshThreads}
          refreshing={pendingRefresh}
          renderItem={({ item, index }) => (
            <MessageRow
              participants={item.participants}
              message={item.latestMessage}
              unread={item.unread}
              currentUser={currentUser}
              isLast={index === threads.length - 1}
              showThread={showThread}
            />
          )}
        />
        {/* {!isConnected && (
          <NotificationOverlay
            position='bottom'
            type='error'
            permanent
            message='RECONNECTING...'
            onPress={this.scrollToBottom}
          />
        )} */}
      </View>
    )
  }
}

export function MessageRow ({ message, participants, currentUser, showThread, isLast, unread }) {
  return (
    <View>
      <TouchableOpacity onPress={() => showThread(message.messageThread)}>
        <ThreadCard
          unread={unread}
          message={message}
          participants={participants}
          currentUser={currentUser}
          isLast={isLast}
        />
      </TouchableOpacity>
    </View>
  )
}
