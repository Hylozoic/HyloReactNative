import React, { Component } from 'react'
import { FlatList, TouchableOpacity, View, Text } from 'react-native'
import { useIsFocused } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import ModalHeader from 'navigation/headers/ModalHeader'
import NotificationCard from 'components/NotificationCard'
import CreateGroupNotice from 'components/CreateGroupNotice'
import Loading from 'components/Loading'
import cardStyles from 'components/NotificationCard/NotificationCard.styles'
import styles from './NotificationsList.styles'

export default function NotificationsList (props) {
  const isFocused = useIsFocused()
  const { t } = useTranslation()
  return <NotificationsListClassComponent {...props} isFocused={isFocused} t={t} />
}
export class NotificationsListClassComponent extends Component {
  state = { ready: false }

  setHeader = () => {
    const { navigation, markAllActivitiesRead, t } = this.props
    navigation.setOptions({
      title: t('Notifications'),
      header: props =>
        <ModalHeader
          {...props}
          headerRightButtonLabel={t('Mark as read')}
          headerRightButtonOnPress={markAllActivitiesRead}
        />
    })
  }

  componentDidMount () {
    const { fetchNotifications, updateNewNotificationCount } = this.props
    this.setHeader()
    fetchNotifications()
    updateNewNotificationCount()
  }

  componentDidUpdate (prevProps) {
    const { fetchNotifications, updateNewNotificationCount } = this.props
    if (!prevProps.isFocused && this.props.isFocused) {
      this.setHeader()
      fetchNotifications()
      updateNewNotificationCount()
    }
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    if (!this.props.pending && nextProps.pending) {
      this.setState({ ready: true })
    }
  }

  shouldComponentUpdate (nextProps) {
    return nextProps.isFocused
  }

  fetchMore = offset => this.props.fetchMore(offset)

  keyExtractor = item => item.id

  render () {
    const { hasMore, markActivityRead, notifications, pending, currentUserHasMemberships, goToCreateGroup, t } = this.props
    const { ready } = this.state

    if (!currentUserHasMemberships) {
      return (
        <CreateGroupNotice
          goToCreateGroup={goToCreateGroup}
          text={t('No notifications here, try creating your own Group!')}
        />
      )
    }

    if (ready && !pending && notifications.length === 0) {
      return <Text style={styles.center}>{t('Nothing new for you!')}</Text>
    }

    return (
      <View style={styles.notificationsList}>
        {
          pending &&
            <View style={cardStyles.container}>
              <View style={cardStyles.content}>
                <Loading />
              </View>
            </View>
        }
        <FlatList
          data={notifications}
          keyExtractor={this.keyExtractor}
          onEndReached={hasMore ? () => this.fetchMore(notifications.length) : null}
          renderItem={({ item }) =>
            <NotificationRow
              markActivityRead={markActivityRead}
              notification={item}
            />}
        />
      </View>
    )
  }
}

export function NotificationRow ({ markActivityRead, notification }) {
  return (
    <View>
      <TouchableOpacity onPress={() => {
        if (notification.unread) markActivityRead(notification.activityId)
        notification.onPress()
      }}
      >
        <NotificationCard notification={notification} />
      </TouchableOpacity>
    </View>
  )
}
