import React, { Component } from 'react'
import { FlatList, TouchableOpacity, View, Text } from 'react-native'
import { isEmpty } from 'lodash/fp'

import header from 'util/header'
import Loading from '../Loading'
import NotificationCard from '../NotificationCard'
import styles from './NotificationsList.styles'

export default class NotificationsList extends Component {
  static navigationOptions = ({ navigation }) => header(navigation, { left: 'close' })

  componentDidMount () {
    const { fetchNotifications, setRightButton } = this.props
    fetchNotifications()
    setRightButton()
  }
  
  keyExtractor = item => item.id

  render () {
    const { fetchMore, notifications, pending, showNotification } = this.props
    if (pending && notifications.length === 0) return <Loading />
    if (!pending && notifications.length === 0) {
      return <Text style={styles.center}>Nothing new for you!</Text>
    }

    return <View style={styles.notificationsList}>
      <FlatList
        data={notifications}
        keyExtractor={this.keyExtractor}
        onEndReached={fetchMore}
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

// setTitle: func.isRequired,
