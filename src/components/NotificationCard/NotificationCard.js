import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { any, bool, func, shape, string } from 'prop-types'

import Avatar from '../Avatar'

import styles from './NotificationCard.styles'

const renderCommunity = community => community
  ? <Text style={styles.community}>${` community`}</Text>
  : null

const renderFirstName = ({ name }) =>
  <Text style={styles.name}>{`${name.split(' ')[0]} `}</Text>

const renderName = ({ actor, nameInHeader }) => nameInHeader
  ? <Text style={styles.name}>{`${actor.name} `}</Text>
  : null

// TODO: render tags as, well, tags
const renderTag = tag => tag
  ? <Text style={styles.name}>{` ${tag}`}</Text>
  : null

const renderTitle = title => title
  ? <Text numberOfLines={2} style={styles.title}>{` ${title}`}</Text>
  : null

export default function NotificationCard ({ notification }) {
  const {
    actor,
    avatarSeparator,
    body,
    community,
    createdAt,
    header,
    onPress,
    tag,
    title,
    unread
  } = notification
  const highlight = unread ? styles.highlight : null

  return <View style={[ styles.container, highlight ]}>
    <View style={avatarSeparator ? styles.separator : null}>
      <Avatar avatarUrl={actor.avatarUrl} style={styles.avatar} />
    </View>
    <View style={styles.content}>
      <Text numberOfLines={2} style={styles.header}>
        {renderName(notification)}
        <Text style={[styles.text, styles.emphasize]}>{header}</Text>
        {renderTitle(title)}
        {renderTag(tag)}
      </Text>
      <Text style={styles.text} numberOfLines={2}>
        {renderFirstName(actor)}
        {body}
        {renderCommunity(community)}
      </Text>
      <Text style={styles.date}>{createdAt}</Text>
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
    onPress: func,
    title: string,
    unread: bool
  })
}
