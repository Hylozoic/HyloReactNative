import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FlatList, TouchableOpacity, View, Text } from 'react-native'
import { useIsFocused, useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { isEmpty } from 'lodash'
import useQueryAction from 'urql-shared/hooks/useQueryAction'
import getMemberships from 'store/selectors/getMemberships'
import {
  fetchNotifications,
  getNotifications,
  getHasMoreNotifications,
  markActivityRead as markActivityReadActionCreator,
  markAllActivitiesRead as markAllActivitiesReadActionCreator,
  updateNewNotificationCount as updateNewNotificationCountActionCreator
} from './NotificationsList.store'
import ModalHeader from 'navigation/headers/ModalHeader'
import NotificationCard from 'components/NotificationCard'
import CreateGroupNotice from 'components/CreateGroupNotice'
import Loading from 'components/Loading'
import cardStyles from 'components/NotificationCard/NotificationCard.styles'
import styles from './NotificationsList.styles'

export default function NotificationsList (props) {
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const isFocused = useIsFocused()
  const { t } = useTranslation()
  const notifications = useSelector(state => getNotifications(state, props))
  const offset = isEmpty(notifications) ? 0 : notifications.length
  const [{ fetching, data, error }, refetch] = useQueryAction({ action: fetchNotifications({ offset }) })
  const hasMore = useSelector(getHasMoreNotifications)
  const memberships = useSelector(getMemberships)
  const currentUserHasMemberships = !isEmpty(memberships)

  const setHeader = () => {
    navigation.setOptions({
      title: t('Notifications'),
      header: props =>
        <ModalHeader
          {...props}
          headerRightButtonLabel={t('Mark as read')}
          headerRightButtonOnPress={() => dispatch(markAllActivitiesReadActionCreator())}
        />
    })
  }

  const markActivityRead = id => dispatch(markActivityReadActionCreator(id))
  const updateNewNotificationCount = () => dispatch(updateNewNotificationCountActionCreator())
  const goToCreateGroup = () => navigation.navigate('Create Group')

  useEffect(() => {
    setHeader()
    updateNewNotificationCount()
  }, [])

  useEffect(() => {
    if (isFocused) {
      setHeader()
      refetch && refetch()
      updateNewNotificationCount()
    }
  }, [isFocused])

  const keyExtractor = item => item.id

  if (!currentUserHasMemberships) {
    return (
      <CreateGroupNotice
        goToCreateGroup={goToCreateGroup}
        text={t('No notifications here, try creating your own Group!')}
      />
    )
  }

  if (!fetching && notifications.length === 0) {
    return <Text style={styles.center}>{t('Nothing new for you!')}</Text>
  }

  return (
    <View style={styles.notificationsList}>
      {fetching && (
        <View style={cardStyles.container}>
          <View style={cardStyles.content}>
            <Loading />
          </View>
        </View>
      )}
      <FlatList
        data={notifications}
        keyExtractor={keyExtractor}
        onEndReached={hasMore ? () => refetch && refetch() : null}
        renderItem={({ item }) =>
          <NotificationRow
            markActivityRead={markActivityRead}
            notification={item}
          />}
      />
    </View>
  )
}

function NotificationRow ({ markActivityRead, notification }) {
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
