import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { any, bool, shape, string } from 'prop-types'

import Avatar from '../Avatar'

import styles from './NotificationCard.styles'

const renderName = ({ actor, nameInHeader }) =>
  nameInHeader ? <Text style={styles.name}>{`${actor.name} `}</Text> : null

const renderTitle = title => title ? <Text style={styles.title}>{` ${title}`}</Text> : null

export default function NotificationCard ({ notification }) {
  const { actor, avatarSeparator, body, createdAt, header, title, unread } = notification

  return <View style={[ styles.container, unread ? styles.highlight : null ]}>
    <View style={avatarSeparator ? styles.separator : null}>
      <Avatar avatarUrl={actor.avatarUrl} style={styles.avatar} />
    </View>
    <View style={styles.content}>
      <View style={styles.header}>
        {renderName(notification)}
        <Text style={[styles.text, styles.emphasize]}>{header}</Text>
        {renderTitle(title)}
      </View>
      <Text style={styles.text} numberOfLines={2}>
        <Text style={styles.name}>{`${actor.name} `}</Text>
        {body}
      </Text>
      <Text style={styles.date}>{createdAt}</Text>
      <Text style={styles.date}>A: {avatarSeparator.toString()}</Text>
    </View>
  </View>
}

NotificationCard.propTypes = {
  notification: shape({
    id: any,
    activityId: any,
    actor: shape({
      name: string,
      avatarUrl: string
    }),
    createdAt: string,
    body: string,
    header: string,
    nameInHeader: bool,
    title: string,
    unread: bool
  })
}
