import React from 'react'
import { Image, View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native'
import Loading from '../Loading'
import styles from './BlockedUsers.styles'
import header from 'util/header'

export default class BlockedUsers extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return header(navigation, {
      title: 'Blocked Users',
      options: {
        headerBackTitle: null
      }
    })
  }

  unBlockUser = userId => () => this.props.unBlockUser(userId)

  render () {    
    const { blockedUsers, loading } = this.props
    
    if (loading) return <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Loading />
    </ScrollView>

    if (!blockedUsers || blockedUsers.length < 1) return <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.noBlockedUsersMessage}>No members currently blocked.</Text>
    </ScrollView>

    return <ScrollView contentContainerStyle={styles.scrollContainer}>
      {blockedUsers.map(blockedUser =>
        <BlockedUserRow user={blockedUser} unBlockUser={this.unBlockUser(blockedUser.id)} key={blockedUser.id} />)}
    </ScrollView>
  }
}

export function BlockedUserRow ({ user, unBlockUser }) {
  return <View style={styles.settingsRow}>
    <View style={styles.nameRow}>
      <Text style={styles.linkText}>{user.name}</Text>
      <TouchableOpacity onPress={unBlockUser} style={styles.unBlockButton}>
        <Text style={styles.unBlockButtonText}>Unblock</Text>
      </TouchableOpacity>  
    </View>
  </View>
}
