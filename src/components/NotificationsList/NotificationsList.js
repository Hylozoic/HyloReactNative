import React, { Component } from 'react'
import { FlatList, TouchableOpacity, View, Text } from 'react-native'

import header from 'util/header'
import Loading from '../Loading'
import NotificationCard from '../NotificationCard'
import styles from './NotificationsList.styles'

export default class NotificationsList extends Component {
  state = {ready: false}

  static navigationOptions = ({ navigation }) =>
    header(navigation, {
      left: 'close',
      title: 'Notifications'
    })

  componentDidMount () {
    const { fetchNotifications, setRightButton, updateNewNotificationCount } = this.props
    setRightButton()
    fetchNotifications()
    updateNewNotificationCount()
  }

  componentWillReceiveProps (nextProps) {
    if (!this.props.pending && nextProps.pending) {
      this.setState({ ready: true })
    }
  }

  fetchMore = offset => this.props.fetchMore(offset)

  keyExtractor = item => item.id

  render () {
    const { hasMore, markActivityRead, notifications, pending } = this.props
    const { ready } = this.state
    if (!ready || (pending && notifications.length === 0)) return <Loading />
    if (ready && !pending && notifications.length === 0) {
      return <Text style={styles.center}>Nothing new for you!</Text>
    }

    return <View style={styles.notificationsList}>
      <FlatList
        data={notifications}
        keyExtractor={this.keyExtractor}
        onEndReached={hasMore ? () => this.fetchMore(notifications.length) : null}
        renderItem={({ item }) =>
          <NotificationRow
            markActivityRead={markActivityRead}
            notification={item} />} />
    </View>
  }
}

export function NotificationRow ({ markActivityRead, notification }) {
  return <View>
    <TouchableOpacity onPress={() => {
      if (notification.unread) markActivityRead(notification.activityId)
      notification.onPress()
    }}>
      <NotificationCard notification={notification} />
    </TouchableOpacity>
  </View>
}
