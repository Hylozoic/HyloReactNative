import React from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import KeyboardFriendlyView from '../KeyboardFriendlyView'
import Loading from '../Loading'
import Button from '../Button'
import Icon from '../Icon'
import styles from './UserSettings.styles'

export default class Signup extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Edit Account Info',
      headerStyle: styles.header,
      headerTintColor: styles.headerTintColor,
      headerTitleStyle: styles.headerTitleStyle
    }
  }
  render () {
    const { currentUser, saveChanges, cancel } = this.props
    if (!currentUser) return <Loading />
    return <KeyboardFriendlyView style={styles.container}>
      <ScrollView>
        <View style={styles.setting}>
          <Text style={styles.settingLabel}>EMAIL</Text>
          <Text style={styles.settingText}>{currentUser.email}</Text>
        </View>
        <View style={styles.setting}>
          <Text style={styles.settingLabel}>PASSWORD</Text>
          <Text style={styles.settingText}>{currentUser.email}</Text>
        </View>
        <SocialAccounts />
        <Footer saveChanges={saveChanges} cancel={cancel} />
      </ScrollView>
    </KeyboardFriendlyView>
  }
}

export function SocialAccounts () {
  return <View style={styles.socialAccounts}>
    <Text style={styles.settingLabel}>SOCIAL ACCOUNTS</Text>

  </View>
}

export function Footer ({ saveChanges, cancel }) {
  return <View style={styles.footer}>
    <View style={styles.editProfile}>
      <Icon name='Members' /><Text>Edit Profile Info</Text>
    </View>
    <Button text='Save Changes' onPress={saveChanges} />
    <TouchableOpacity onPress={cancel}>
      <Text style={styles.cancel}>Cancel</Text>
    </TouchableOpacity>
  </View>
}
