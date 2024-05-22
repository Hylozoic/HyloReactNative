import React from 'react'
import { Text, View } from 'react-native'
import { any, bool, func, shape, string } from 'prop-types'

import Avatar from 'components/Avatar'

import styles from './NotificationCard.styles'

const renderGroup = group => group
  ? <Text style={styles.group}>{` ${group}`}</Text>
  : null

const renderFirstName = ({ name }) =>
  <Text style={styles.name}>{`${name.split(' ')[0]} `}</Text>

const renderName = ({ actor, nameInHeader }) => nameInHeader
  ? <Text style={styles.name}>{`${actor.name} `}</Text>
  : null

// TODO: render channels as, well, channels
const renderObjectName = channel => channel
  ? <Text style={styles.name}>{` ${channel}`}</Text>
  : null

const renderTitle = title => title
  ? <Text numberOfLines={2} style={styles.title}>{` ${title}`}</Text>
  : null

export default function NotificationCard ({ notification }) {
  const {
    actor,
    avatarSeparator,
    body,
    group,
    createdAt,
    header,
    objectName,
    title,
    unread
  } = notification
  const highlight = unread ? styles.highlight : null
  console.log(notification?.title)
  return (
    <View style={[styles.container, highlight]}>
      <View style={avatarSeparator ? styles.separator : null}>
        <Avatar avatarUrl={actor.avatarUrl} style={styles.avatar} />
      </View>
      <View style={styles.content}>
        <Text numberOfLines={2} style={styles.header}>
          {unread && <Text style={styles.badge}>● </Text>}
          {renderName(notification)}
          <Text style={[styles.text, styles.emphasize]}>{header}</Text>
          {renderTitle(title)}
          {renderObjectName(objectName)}
        </Text>
        <Text style={styles.text}>
          {renderFirstName(actor)}
          {body}
          {renderGroup(group)}
        </Text>
        <Text style={styles.date}>{createdAt}</Text>
      </View>
    </View>
  )
}

NotificationCard.propTypes = {
  notification: shape({
    id: any,
    activityId: any,
    actor: shape({
      name: string,
      avatarUrl: string
    }),
    group: string,
    createdAt: string,
    body: string,
    header: string,
    nameInHeader: bool,
    title: string,
    channel: string,
    unread: bool
  })
}
