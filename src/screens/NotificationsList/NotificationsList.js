import React, { useEffect, useState, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { FlatList, TouchableOpacity, View, Text } from 'react-native'
import { useIsFocused, useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import ModalHeader from 'navigation/headers/ModalHeader'
import NotificationCard from 'components/NotificationCard'
import CreateGroupNotice from 'components/CreateGroupNotice'
import Loading from 'components/Loading'
import cardStyles from 'components/NotificationCard/NotificationCard.styles'
import styles from './NotificationsList.styles'
import {
  FETCH_NOTIFICATIONS,
  fetchNotifications,
  getNotifications,
  getHasMoreNotifications,
  markActivityRead,
  markAllActivitiesRead,
  updateNewNotificationCount
} from './NotificationsList.store'
import getMemberships from 'store/selectors/getMemberships'
import { isEmpty } from 'lodash'

const NOTIFICATIONS_PAGE_SIZE = 20

export const NotificationsList = (props) => {
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const isFocused = useIsFocused()
  const { t } = useTranslation()

  const [ready, setReady] = useState(false)

  const hasMore = useSelector(getHasMoreNotifications)
  const pending = useSelector(state => state.pending[FETCH_NOTIFICATIONS])
  const notifications = useSelector(state => getNotifications(state, props))
  const currentUserHasMemberships = useSelector(state => !isEmpty(getMemberships(state)))

  const fetchNotificationsHandler = useCallback(() => {
    dispatch(fetchNotifications(NOTIFICATIONS_PAGE_SIZE))
  }, [dispatch])

  const fetchMoreHandler = useCallback((offset) => {
    dispatch(fetchNotifications(NOTIFICATIONS_PAGE_SIZE, offset))
  }, [dispatch])

  const markAllActivitiesReadHandler = useCallback(() => {
    dispatch(markAllActivitiesRead())
  }, [dispatch])

  const markActivityReadHandler = useCallback((id) => {
    dispatch(markActivityRead(id))
  }, [dispatch])

  const updateNewNotificationCountHandler = useCallback(() => {
    dispatch(updateNewNotificationCount())
  }, [dispatch])

  const goToCreateGroupHandler = useCallback(() => {
    navigation.navigate('Create Group')
  }, [navigation])

  const setHeader = useCallback(() => {
    navigation.setOptions({
      title: t('Notifications'),
      header: props => (
        <ModalHeader
          {...props}
          headerRightButtonLabel={t('Mark as read')}
          headerRightButtonOnPress={markAllActivitiesReadHandler}
        />
      )
    })
  }, [navigation, t, markAllActivitiesReadHandler])

  useEffect(() => {
    setHeader()
    fetchNotificationsHandler()
    updateNewNotificationCountHandler()
  }, [setHeader, fetchNotificationsHandler, updateNewNotificationCountHandler])

  useEffect(() => {
    if (isFocused) {
      setHeader()
      fetchNotificationsHandler()
      updateNewNotificationCountHandler()
    }
  }, [isFocused, setHeader, fetchNotificationsHandler, updateNewNotificationCountHandler])

  useEffect(() => {
    if (!pending) {
      setReady(true)
    }
  }, [pending])

  if (!currentUserHasMemberships) {
    return (
      <CreateGroupNotice
        goToCreateGroup={goToCreateGroupHandler}
        text={t('No notifications here, try creating your own Group!')}
      />
    )
  }

  if (ready && !pending && notifications.length === 0) {
    return <Text style={styles.center}>{t('Nothing new for you!')}</Text>
  }

  return (
    <View style={styles.notificationsList}>
      {pending && (
        <View style={cardStyles.container}>
          <View style={cardStyles.content}>
            <Loading />
          </View>
        </View>
      )}
      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        onEndReached={hasMore ? () => fetchMoreHandler(notifications.length) : null}
        renderItem={({ item }) => (
          <NotificationRow
            markActivityRead={markActivityReadHandler}
            notification={item}
          />
        )}
      />
    </View>
  )
}

export const NotificationRow = ({ markActivityRead, notification }) => {
  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          if (notification.unread) markActivityRead(notification.activityId)
          notification.onPress()
        }}
      >
        <NotificationCard notification={notification} />
      </TouchableOpacity>
    </View>
  )
}

export default NotificationsList
