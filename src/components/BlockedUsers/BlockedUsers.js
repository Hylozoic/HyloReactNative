import React from 'react'
import { Image, View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native'
import Loading from '../Loading'
import styles from './BlockedUsers.styles'
import header from 'util/header'

const blockedUsers = [
  {id: 1, name: 'Narcissitic Ex-girlfriend'},
  {id: 2, name: 'Abusive User'}
]
export default class BlockedUsers extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return header(navigation, {
      title: 'Blocked Users',
      options: {
        headerBackTitle: null
      }
    })
  }

  unblockUser = user => () => {
    console.log('unblocking user', user)
  }

  render () {
    // const { messageSettings  } = this.props
    // if (!messageSettings) return <Loading />

    return <ScrollView contentContainerStyle={styles.scrollContainer}>
      {blockedUsers.map(blockedUser =>
        <BlockedUserRow key={blockedUser.id} user={blockedUser} unblockUser={this.unblockUser} />)}
    </ScrollView>
  }
}

export function BlockedUserRow ({ user, unblockUser }) {
  return <View style={styles.settingsRow}>
    <View style={styles.nameRow}>
      <Text style={styles.linkText}>{user.name}</Text>
      <TouchableOpacity onPress={unblockUser(user)}>
        <Text style={styles.unBlockButtonText}>Unblock</Text>
      </TouchableOpacity>  
    </View>
  </View>
}
