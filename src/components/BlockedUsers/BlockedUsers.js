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

    if (loading) return <Loading />

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
      <TouchableOpacity onPress={unBlockUser}>
        <Text style={styles.unBlockButtonText}>Unblock</Text>
      </TouchableOpacity>  
    </View>
  </View>
}
