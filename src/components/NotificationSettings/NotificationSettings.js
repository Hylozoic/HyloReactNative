import React from 'react'
import { Image, View, Text, ScrollView, TouchableOpacity } from 'react-native'
// import prompt from 'react-native-prompt-android'
import Loading from '../Loading'
import Icon from '../Icon'
import styles from './NotificationSettings.styles'
// import { any, values, isNil } from 'lodash/fp'
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
    const { currentUser, updateMembershipSettings } = this.props
    if (!currentUser) return <Loading />

    const { settings, memberships } = currentUser

    return <ScrollView contentContainerStyle={styles.scrollContainer}>
      {memberships.map(membership => <MembershipSettingsRow
        key={membership.id}
        membership={membership}
        updateMembershipSettings={updateMembershipSettings} />)}
    </ScrollView>
  }
}

export function MembershipSettingsRow ({ membership, updateMembershipSettings }) {
  console.log('membership', membership)
  return <SettingsRow
    imageUrl={membership.community.avatarUrl}
    name={membership.community.name}
    settings={membership.settings}
    update={updateMembershipSettings} />
}

export class SettingsRow extends React.Component {
  state = {
    expanded: false
  }

  toggleExpand = () => {
    this.setState({
      expanded: !this.state.expanded
    })
  }

  render () {
    const { imageUrl, name, settings, update } = this.props
    const { expanded } = this.state
    return <View style={styles.settingsRow}>
      <View style={styles.row}>
        <Image source={{uri: imageUrl}} style={styles.communityAvatar} />
        <Text>{name}</Text>
        <TouchableOpacity onPress={this.toggleExpand}>
          {expanded ? <Icon name='ArrowUp' style={styles.icon} /> : <Icon name='ArrowDown' style={styles.icon} />}
        </TouchableOpacity>
      </View>
      {expanded && <View style={styles.iconRow}>
        <SettingsIcon settingKey='sendPushNotifications' name='PushNotification' settings={settings} update={update} />
        <SettingsIcon settingKey='sendEmail' name='EmailNotification' settings={settings} update={update} />
      </View>}
    </View>
  }
}

export function SettingsIcon ({ settingKey, name, update, settings }) {
  return <TouchableOpacity onPress={() => update({[settingKey]: !settings[settingKey]})}>
    <Icon name={name} style={[styles.icon, settings[settingKey] && styles.highlightIcon]} />
  </TouchableOpacity>
}
