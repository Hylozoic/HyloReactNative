import React, { Component } from 'react'
import { FlatList, TouchableOpacity, View, Text } from 'react-native'
import { isEmpty } from 'lodash/fp'

import Loading from '../Loading'
import NotificationCard from '../NotificationCard'
import Header from './Header'
import styles from './NotificationsList.styles'

export default class NotificationsList extends Component {
  static navigationOptions = ({navigation}) => (Header(navigation))

  fetchOrShowCached () {
    const { hasMore, notifications, fetchNotifications } = this.props
    if (isEmpty(notifications) && hasMore !== false) fetchNotifications()
  }

  componentDidMount () {
    this.fetchOrShowCached()
  }

  keyExtractor = item => item.id

  render () {
    const { notifications, pending, currentUser, fetchMoreNotifications, showNotification } = this.props

    if (pending && notifications.length === 0) return <Loading />
    if (!pending && notifications.length === 0) {
      return <Text style={styles.center}>Nothing new for you!</Text>
    }

    return <View style={styles.notificationsList}>
      <FlatList
        data={notifications}
        keyExtractor={this.keyExtractor}
        onEndReached={fetchMoreNotifications}
        renderItem={({ item }) =>
          <MessageRow
            notifcation={item.notification}
            currentUser={currentUser}
            showNotification={showNotification}
         />}
        />
    </View>
  }
}

export function NotifcationRow ({ notification }) {
  return <View>
    <TouchableOpacity onPress={() => {}}>
      <NotificationCard notification={notification} />
    </TouchableOpacity>
  </View>
}
