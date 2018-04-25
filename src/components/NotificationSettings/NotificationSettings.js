import React from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import prompt from 'react-native-prompt-android'
import Loading from '../Loading'
import Button from '../Button'
import styles from './NotificationSettings.styles'
import { any, values, isNil } from 'lodash/fp'
import header from 'util/header'

export default class NotificationSettings extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return header(navigation, {
      title: 'Notification Settings',
      options: {
        headerBackTitle: null
      }
    })
  }

  render () {
    console.log('NotificationSettings arrived')

    const { currentUser, updateMembershipSettings } = this.props
    if (!currentUser) return <Loading />

    const { settings, memberships } = currentUser

    return <ScrollView contentContainerStyle={styles.scrollContainer}>
      {memberships.map(membership => <MembershipSettingsRow
        membership={membership}
        updateMembershipSettings={updateMembershipSettings} />)}
    </ScrollView>
  }
}

export class SettingsRow extends React.Component {
  state = {
    expanded: false
  }

  render () {
    const { label, value = '' } = this.props
    const { loading } = this.state
    const linked = !!value

    return <View style={[styles.socialControl, linked && styles.linked]}>
      <Text style={styles.settingText}>{label}</Text>
      {loading && <Text style={styles.loadingText}>Loading</Text>}
      {!loading && <TouchableOpacity onPress={linked ? () => this.unlinkClicked() : () => this.linkClicked()}>
        <Text style={styles.linkText}>{linked ? 'Unlink' : 'Link'}</Text>
      </TouchableOpacity>}
    </View>
  }
}
