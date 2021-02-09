import React from 'react'
import { Image, View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native'
import Loading from 'components/Loading'
import Icon from 'components/Icon'
import styles from './NotificationSettings.styles'
const allGroupsLogo = require('assets/hylo-merkaba.png')

export default class NotificationSettings extends React.Component {
  updateMessageSettings = changes => {
    const { messageSettings, updateUserSettings } = this.props
    const newMessageSettings = {
      ...messageSettings,
      ...changes
    }
    let dmNotifications
    if (newMessageSettings.sendEmail && newMessageSettings.sendPushNotifications) {
      dmNotifications = 'both'
    } else if (newMessageSettings.sendEmail) {
      dmNotifications = 'email'
    } else if (newMessageSettings.sendPushNotifications) {
      dmNotifications = 'push'
    } else {
      dmNotifications = 'none'
    }
    updateUserSettings({
      settings: {
        dmNotifications
      }
    })
  }

  updateAllGroups = changes => {
    const { memberships, updateAllMemberships } = this.props
    updateAllMemberships(memberships.map(m => m.group.id), changes)
  }

  updateAllGroupsAlert = changes => {
    const key = ('sendEmail' in changes) ? 'sendEmail' : 'sendPushNotifications'

    const type = key === 'sendEmail' ? 'Email' : 'Push Notifications'
    const onOrOff = changes[key] ? 'ON' : 'OFF'
    const numGroups = this.props.memberships.length

    return Alert.alert(
      `You wish to turn ${onOrOff} ${type} for all groups?`,
      `This will affect ${numGroups} ${numGroups === 1 ? 'group' : 'groups'}`,
      [
        { text: `Turn ${onOrOff}`, onPress: () => this.updateAllGroups(changes) },
        { text: 'Cancel', style: 'cancel' }
      ])
  }

  render () {
    const { messageSettings, allGroupsSettings, memberships, updateMembershipSettings } = this.props
    if (!messageSettings) return <Loading />

    return (
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <MessageSettingsRow
          settings={messageSettings}
          updateMessageSettings={this.updateMessageSettings}
          key={'messageSettings'}
        />
        <AllGroupsSettingsRow
          settings={allGroupsSettings}
          updateAllGroups={this.updateAllGroupsAlert}
          key={'allGroupsSetting'}
        />
        {memberships.map(
          membership => (
            <MembershipSettingsRow
              key={membership.id}
              membership={membership}
              updateMembershipSettings={changes => updateMembershipSettings(membership.group.id, changes)}
            />
          )
        )}
      </ScrollView>
    )
  }
}

export function MessageSettingsRow ({ settings, updateMessageSettings }) {
  return (
    <SettingsRow
      iconName='Messages'
      name='Messages'
      settings={settings}
      update={updateMessageSettings}
    />
  )
}

export function AllGroupsSettingsRow ({ settings, updateAllGroups }) {
  return (
    <SettingsRow
      imageSrc={allGroupsLogo}
      name='All Groups'
      settings={settings}
      update={updateAllGroups}
    />
  )
}

export function MembershipSettingsRow ({ membership, updateMembershipSettings }) {
  return (
    <SettingsRow
      imageUrl={membership.group.avatarUrl}
      name={membership.group.name}
      settings={membership.settings}
      update={updateMembershipSettings}
    />
  )
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
    const { iconName, imageUrl, imageSrc, name, settings, update } = this.props
    const { expanded } = this.state

    const source = imageSrc || { uri: imageUrl }

    return (
      <View style={styles.settingsRow}>
        <View style={styles.nameRow}>
          {iconName && <Icon name={iconName} style={styles.avatarIcon} />}
          {!iconName && <Image source={source} style={styles.groupAvatar} />}
          <Text style={styles.name} numberOfLines={1}>{name}</Text>
          <TouchableOpacity onPress={this.toggleExpand} style={styles.arrowWrapper}>
            {expanded ? <Icon name='ArrowUp' style={styles.arrowIcon} /> : <Icon name='ArrowDown' style={styles.arrowIcon} />}
          </TouchableOpacity>
        </View>
        {expanded && (
          <View style={styles.iconRow}>
            <SettingsIcon settingKey='sendPushNotifications' name='PushNotification' settings={settings} update={update} />
            <SettingsIcon settingKey='sendEmail' name='EmailNotification' settings={settings} update={update} />
          </View>
        )}
      </View>
    )
  }
}

export function SettingsIcon ({ settingKey, name, update, settings }) {
  return (
    <TouchableOpacity onPress={() => update({ [settingKey]: !settings[settingKey] })}>
      <Icon name={name} style={[styles.icon, settings[settingKey] && styles.highlightIcon]} />
    </TouchableOpacity>
  )
}
