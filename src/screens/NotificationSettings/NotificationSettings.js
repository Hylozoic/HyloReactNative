import React from 'react'
import { Image, View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native'
import Loading from 'components/Loading'
import Icon from 'components/Icon'
import styles from './NotificationSettings.styles'
const allCommunitiesLogo = require('assets/hylo-merkaba.png')

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

  updateAllCommunities = changes => {
    const { memberships, updateAllMemberships } = this.props
    updateAllMemberships(memberships.map(m => m.community.id), changes)
  }

  updateAllCommunitiesAlert = changes => {
    const key = ('sendEmail' in changes) ? 'sendEmail' : 'sendPushNotifications'

    const type = key === 'sendEmail' ? 'Email' : 'Push Notifications'
    const onOrOff = changes[key] ? 'ON' : 'OFF'
    const numCommunities = this.props.memberships.length

    return Alert.alert(
      `You wish to turn ${onOrOff} ${type} for all communities?`,
      `This will affect ${numCommunities} ${numCommunities === 1 ? 'community' : 'communities'}`,
      [
        { text: `Turn ${onOrOff}`, onPress: () => this.updateAllCommunities(changes) },
        { text: 'Cancel', style: 'cancel' }
      ])
  }

  render () {
    const { messageSettings, allCommunitiesSettings, memberships, updateMembershipSettings } = this.props
    if (!messageSettings) return <Loading />

    return (
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <MessageSettingsRow
          settings={messageSettings}
          updateMessageSettings={this.updateMessageSettings}
          key={'messageSettings'}
        />
        <AllCommunitiesSettingsRow
          settings={allCommunitiesSettings}
          updateAllCommunities={this.updateAllCommunitiesAlert}
          key={'allCommunitiesSetting'}
        />
        {memberships.map(
          membership => (
            <MembershipSettingsRow
              key={membership.id}
              membership={membership}
              updateMembershipSettings={changes => updateMembershipSettings(membership.community.id, changes)}
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

export function AllCommunitiesSettingsRow ({ settings, updateAllCommunities }) {
  return (
    <SettingsRow
      imageSrc={allCommunitiesLogo}
      name='All Communities'
      settings={settings}
      update={updateAllCommunities}
    />
  )
}

export function MembershipSettingsRow ({ membership, updateMembershipSettings }) {
  return (
    <SettingsRow
      imageUrl={membership.community.avatarUrl}
      name={membership.community.name}
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
          {!iconName && <Image source={source} style={styles.communityAvatar} />}
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
