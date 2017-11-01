import React, { Component } from 'react'
import { FlatList, TouchableOpacity, View, Text } from 'react-native'
import { isEmpty } from 'lodash/fp'
import header from 'util/header'
import Loading from '../Loading'
import ThreadCard from '../ThreadCard'
import styles from './ThreadList.styles'
import NotificationOverlay from '../NotificationOverlay'
import { getSocket } from 'util/websockets'

export default class ThreadList extends Component {
  static navigationOptions = ({ navigation }) =>
    header(navigation, {
      left: 'close',
      title: 'Messages',
      right: {text: 'New', onPress: () => navigation.navigate('NewMessage')}
    })

  constructor () {
    super()
    this.state = { ready: false }
  }

  componentDidMount () {
    this.fetchOrShowCached()
    getSocket().then(socket => socket.on('reconnect', this.props.refreshThreads))
  }

  componentWillReceiveProps (nextProps) {
    if (!this.props.pending && nextProps.pending) {
      this.setState({ ready: true })
    }
  }

  fetchOrShowCached () {
    const { hasMore, threads, fetchThreads } = this.props
    if (isEmpty(threads) && hasMore !== false) return fetchThreads()
    if (!this.state.ready) this.setState({ ready: true })
  }

  _keyExtractor = (item, index) => item.id

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

    if (!ready || (pending && threads.length === 0)) return <Loading />
    if (ready && !pending && threads.length === 0) {
      return <Text style={styles.center}>No active conversations</Text>
    }

    return <View style={styles.threadList}>
      <FlatList
        data={threads}
        keyExtractor={this._keyExtractor}
        onEndReached={fetchMoreThreads}
        onRefresh={refreshThreads}
        refreshing={pendingRefresh}
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
      {!isConnected && <NotificationOverlay
        position='bottom'
        type='error'
        permanent
        message='RECONNECTING...'
        onPress={this.scrollToBottom} />}
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
