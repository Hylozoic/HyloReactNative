import React from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import LoadingScreen from 'screens/LoadingScreen'
import styles from './BlockedUsers.styles'

export default class BlockedUsers extends React.Component {
  unBlockUser = userId => () => this.props.unBlockUser(userId)

  render () {
    const { blockedUsers, loading } = this.props

    if (loading) return <LoadingScreen />

    if (!blockedUsers || blockedUsers.length < 1) {
      return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.noBlockedUsersMessage}>No members currently blocked.</Text>
        </ScrollView>
      )
    }

    return (
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {blockedUsers.map(blockedUser =>
          <BlockedUserRow user={blockedUser} unBlockUser={this.unBlockUser(blockedUser.id)} key={blockedUser.id} />)}
      </ScrollView>
    )
  }
}

export function BlockedUserRow ({ user, unBlockUser }) {
  return (
    <View style={styles.settingsRow}>
      <View style={styles.nameRow}>
        <Text style={styles.linkText}>{user.name}</Text>
        <TouchableOpacity onPress={unBlockUser} style={styles.unBlockButton}>
          <Text style={styles.unBlockButtonText}>Unblock</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
