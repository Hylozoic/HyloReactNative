import React, { Component } from 'react'
import { FlatList, TouchableOpacity, View, Text } from 'react-native'
import { isEmpty } from 'lodash/fp'
import { getSocket } from 'util/websockets'
import LoadingScreen from 'screens/LoadingScreen'
import NotificationOverlay from 'components/NotificationOverlay'
import ThreadCard from 'components/ThreadCard'
import styles from './ThreadList.styles'

export default class ThreadList extends Component {
  state = { ready: false }

  componentDidMount () {
    this.props.updateLastViewed()
    this.fetchOrShowCached()
    getSocket().then(socket => socket.on('reconnect', this.props.refreshThreads))
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    if (!this.props.pending && nextProps.pending) {
      this.setState({ ready: true })
    }
  }

  shouldComponentUpdate (nextProps) {
    return nextProps.isFocused
  }

  fetchOrShowCached () {
    const { hasMore, threads, fetchThreads } = this.props
    if (isEmpty(threads) && hasMore !== false) return fetchThreads()
    if (!this.state.ready) this.setState({ ready: true })
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
      pendingRefresh,
      isConnected
    } = this.props
    const { ready } = this.state

    if (!ready || (pending && threads.length === 0)) return <LoadingScreen />
    if (ready && !pending && threads.length === 0) {
      return <Text style={styles.center}>No active conversations</Text>
    }

    return (
      <View style={styles.threadList}>
        <FlatList
          data={threads}
          keyExtractor={this._keyExtractor}
          onEndReached={fetchMoreThreads}
          onRefresh={refreshThreads}
          refreshing={pendingRefresh}
          renderItem={({ item, index }) => <MessageRow
            participants={item.participants}
            message={item.latestMessage}
            unread={item.unread}
            currentUser={currentUser}
            isLast={index === threads.length - 1}
            showThread={showThread}
                                           />}
        />
        {!pending && threads.length === 0 &&
          <Text style={styles.center}>No active conversations</Text>}
        {!isConnected && <NotificationOverlay
          position='bottom'
          type='error'
          permanent
          message='RECONNECTING...'
          onPress={this.scrollToBottom}
                         />}
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
