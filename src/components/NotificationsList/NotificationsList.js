import React, { Component } from 'react'
import { FlatList, TouchableOpacity, View, Text } from 'react-native'
import { isEmpty } from 'lodash/fp'

import Loading from '../Loading'
import NotificationCard from '../NotificationCard'
import Header from './Header'
import styles from './NotificationsList.styles'

export default class NotificationsList extends Component {
  static navigationOptions = ({navigation}) => (Header(navigation))

  componentDidMount () {
    this.props.fetchNotifications()
  }

  keyExtractor = item => item.id

  render () {
    const { notifications, pending, showNotification } = this.props

    if (pending && notifications.length === 0) return <Loading />
    if (!pending && notifications.length === 0) {
      return <Text style={styles.center}>Nothing new for you!</Text>
    }

    return <View style={styles.notificationsList}>
      <FlatList
        data={notifications}
        keyExtractor={this.keyExtractor}
        // onEndReached={fetchMoreNotifications}
        renderItem={({ item }) =>
          <NotificationRow
            notification={item}
            showNotification={showNotification}
         />}
        />
    </View>
  }
}

export function NotificationRow ({ notification, showNotification }) {
  return <View>
    <TouchableOpacity onPress={() => {}}>
      <NotificationCard notification={notification} />
    </TouchableOpacity>
  </View>
}
